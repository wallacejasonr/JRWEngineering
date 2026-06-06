"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { InvoiceStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth-helpers";
import {
  type FormState,
  getOptionalString,
  getString,
  zodErrorsToFieldErrors,
} from "@/lib/form-state";

const InvoiceMetaSchema = z.object({
  invoiceDate: z.coerce.date(),
  dueDate: z.union([z.coerce.date(), z.null()]),
  invoiceService: z.string().min(1, "Service is required").max(200),
  notes: z.string().max(5000).nullable(),
});

const LineItemSchema = z.object({
  service: z.string().min(1, "Service is required").max(200),
  phaseDescription: z.string().min(1, "Phase description is required").max(200),
  contractAmount: z.coerce.number().nonnegative(),
  percentComplete: z.coerce.number().min(0).max(100),
  invoiceAmount: z.coerce.number().nonnegative(),
});

const PaymentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  receivedDate: z.coerce.date(),
  method: z.enum(["check", "ach", "cash", "card", "other"]),
  reference: z.string().max(100).nullable(),
  notes: z.string().max(2000).nullable(),
});

function dateOrNull(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

async function recomputeTotal(invoiceId: string): Promise<void> {
  const items = await prisma.invoiceLineItem.findMany({
    where: { invoiceId },
    select: { invoiceAmount: true },
  });
  const total = items.reduce(
    (sum, item) => sum.plus(item.invoiceAmount),
    new Prisma.Decimal(0)
  );
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { total },
  });
}

async function recomputeInvoiceStatus(invoiceId: string): Promise<void> {
  const inv = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { status: true, total: true, dueDate: true },
  });
  if (!inv) return;
  if (inv.status === "draft" || inv.status === "cancelled") return;

  const agg = await prisma.payment.aggregate({
    where: { invoiceId },
    _sum: { amount: true },
    _max: { receivedDate: true },
  });
  const sum = agg._sum.amount ?? new Prisma.Decimal(0);
  const total = inv.total;

  let nextStatus: InvoiceStatus;
  let paidAt: Date | null = null;
  if (sum.gte(total) && total.gt(0)) {
    nextStatus = "paid";
    paidAt = agg._max.receivedDate ?? new Date();
  } else if (sum.gt(0)) {
    nextStatus = "partial";
  } else if (inv.dueDate && inv.dueDate < new Date()) {
    nextStatus = "overdue";
  } else {
    nextStatus = "sent";
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: nextStatus, paidAt },
  });
}

async function assertNotArchived(invoiceId: string): Promise<void> {
  const inv = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { archivedAt: true },
  });
  if (inv?.archivedAt) {
    throw new Error("Cannot modify — the parent project is archived.");
  }
}

export async function updateInvoice(
  invoiceId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();
  await assertNotArchived(invoiceId);

  const input = {
    invoiceDate: getString(formData, "invoiceDate"),
    dueDate: dateOrNull(getString(formData, "dueDate")),
    invoiceService: getString(formData, "invoiceService"),
    notes: getOptionalString(formData, "notes"),
  };

  const parse = InvoiceMetaSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: parse.data,
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  redirect(`/dashboard/invoices/${invoiceId}`);
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  await requireAdmin();
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { status: true, projectId: true, archivedAt: true },
  });
  if (!invoice) return;
  if (invoice.archivedAt) {
    throw new Error("Cannot modify — the parent project is archived.");
  }
  if (invoice.status !== "draft" && invoice.status !== "cancelled") {
    throw new Error("Only draft or cancelled invoices can be deleted.");
  }
  await prisma.invoice.delete({ where: { id: invoiceId } });
  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/projects/${invoice.projectId}`);
  redirect("/dashboard/invoices");
}

export async function setInvoiceStatus(
  invoiceId: string,
  status: "draft" | "sent" | "overdue" | "cancelled"
): Promise<void> {
  if (status === "cancelled") {
    await requireAdmin();
  } else {
    await requireUser();
  }
  await assertNotArchived(invoiceId);

  const data: {
    status: "draft" | "sent" | "overdue" | "cancelled";
    sentAt?: Date | null;
    paidAt?: Date | null;
  } = { status };

  if (status === "sent") data.sentAt = new Date();
  if (status === "draft") {
    data.sentAt = null;
    data.paidAt = null;
  }

  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data,
    select: { projectId: true },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  revalidatePath(`/dashboard/projects/${updated.projectId}`);
}

export async function recordPayment(
  invoiceId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();
  await assertNotArchived(invoiceId);

  const inv = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { status: true },
  });
  if (!inv) return { ok: false, message: "Invoice not found." };
  if (inv.status === "draft" || inv.status === "cancelled") {
    return {
      ok: false,
      message: "Cannot record a payment on a draft or cancelled invoice.",
    };
  }

  const input = {
    amount: getString(formData, "amount").replace(/[^0-9.]/g, ""),
    receivedDate: getString(formData, "receivedDate"),
    method: getString(formData, "method"),
    reference: getOptionalString(formData, "reference"),
    notes: getOptionalString(formData, "notes"),
  };

  const parse = PaymentSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  await prisma.payment.create({
    data: { ...parse.data, invoiceId, recordedById: user.id },
  });

  await recomputeInvoiceStatus(invoiceId);
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  revalidatePath("/dashboard/invoices");
  return { ok: true, message: "Payment recorded." };
}

export async function deletePayment(
  invoiceId: string,
  paymentId: string
): Promise<void> {
  await requireAdmin();
  await assertNotArchived(invoiceId);
  await prisma.payment.delete({ where: { id: paymentId } });
  await recomputeInvoiceStatus(invoiceId);
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
}

export async function addLineItem(
  invoiceId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();
  await assertNotArchived(invoiceId);

  const input = {
    service: getString(formData, "service"),
    phaseDescription: getString(formData, "phaseDescription"),
    contractAmount: getString(formData, "contractAmount").replace(/[^0-9.]/g, ""),
    percentComplete: getString(formData, "percentComplete").replace(/[^0-9.]/g, ""),
    invoiceAmount: getString(formData, "invoiceAmount").replace(/[^0-9.]/g, ""),
  };

  const parse = LineItemSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  const count = await prisma.invoiceLineItem.count({ where: { invoiceId } });
  await prisma.invoiceLineItem.create({
    data: { ...parse.data, invoiceId, sortOrder: count },
  });

  await recomputeTotal(invoiceId);
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  return { ok: true, message: "Line item added." };
}

export async function updateLineItem(
  invoiceId: string,
  lineItemId: string,
  formData: FormData
): Promise<void> {
  await requireUser();
  await assertNotArchived(invoiceId);

  const input = {
    service: getString(formData, "service"),
    phaseDescription: getString(formData, "phaseDescription"),
    contractAmount: getString(formData, "contractAmount").replace(/[^0-9.]/g, ""),
    percentComplete: getString(formData, "percentComplete").replace(/[^0-9.]/g, ""),
    invoiceAmount: getString(formData, "invoiceAmount").replace(/[^0-9.]/g, ""),
  };

  const parse = LineItemSchema.safeParse(input);
  if (!parse.success) {
    throw new Error("Invalid line item: " + parse.error.issues[0]?.message);
  }

  await prisma.invoiceLineItem.update({
    where: { id: lineItemId },
    data: parse.data,
  });

  await recomputeTotal(invoiceId);
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
}

export async function deleteLineItem(
  invoiceId: string,
  lineItemId: string
): Promise<void> {
  await requireUser();
  await assertNotArchived(invoiceId);
  await prisma.invoiceLineItem.delete({ where: { id: lineItemId } });
  await recomputeTotal(invoiceId);
  revalidatePath(`/dashboard/invoices/${invoiceId}`);
}
