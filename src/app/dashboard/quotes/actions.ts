"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth-helpers";
import { nextInvoiceNumber, nextQuoteNumber } from "@/lib/numbering";
import {
  type FormState,
  getOptionalString,
  getString,
  zodErrorsToFieldErrors,
} from "@/lib/form-state";

const QuoteSchema = z.object({
  quoteNumber: z.string().min(1, "Quote number is required").max(50),
  projectId: z.string().min(1, "Project is required"),
  date: z.coerce.date(),
  inclusions: z.array(z.string().min(1)),
  exclusions: z.array(z.string().min(1)),
  fee: z.coerce.number().nonnegative("Fee must be 0 or greater"),
  siteVisitRate: z.coerce.number().nonnegative("Site visit rate must be 0 or greater"),
  additionalHourlyRate: z.coerce.number().nonnegative("Additional hourly rate must be 0 or greater"),
  reportRate: z.coerce.number().nonnegative("Report rate must be 0 or greater"),
  billingTerms: z.string().min(1, "Billing terms are required").max(2000),
  notes: z.string().max(5000).nullable(),
});

function parseListField(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0);
}

export async function createQuote(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const input = {
    quoteNumber: getString(formData, "quoteNumber"),
    projectId: getString(formData, "projectId"),
    date: getString(formData, "date"),
    inclusions: parseListField(formData, "inclusions"),
    exclusions: parseListField(formData, "exclusions"),
    fee: getString(formData, "fee").replace(/[^0-9.]/g, ""),
    siteVisitRate: getString(formData, "siteVisitRate").replace(/[^0-9.]/g, ""),
    additionalHourlyRate: getString(formData, "additionalHourlyRate").replace(/[^0-9.]/g, ""),
    reportRate: getString(formData, "reportRate").replace(/[^0-9.]/g, ""),
    billingTerms: getString(formData, "billingTerms"),
    notes: getOptionalString(formData, "notes"),
  };

  const parse = QuoteSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  const existing = await prisma.quote.findUnique({
    where: { quoteNumber: parse.data.quoteNumber },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: { quoteNumber: ["A quote with this number already exists."] },
    };
  }

  const created = await prisma.quote.create({
    data: {
      ...parse.data,
      createdById: user.id,
      status: "draft",
    },
  });

  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/projects/${parse.data.projectId}`);
  redirect(`/dashboard/quotes/${created.id}`);
}

export async function updateQuote(
  quoteId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const current = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: {
      status: true,
      projectId: true,
      quoteNumber: true,
      archivedAt: true,
    },
  });
  if (!current) {
    return { ok: false, message: "Quote not found." };
  }
  if (current.archivedAt) {
    throw new Error("Cannot modify — the parent project is archived.");
  }
  if (current.status !== "draft") {
    return { ok: false, message: "Only draft quotes can be edited." };
  }

  const input = {
    quoteNumber: getString(formData, "quoteNumber"),
    projectId: getString(formData, "projectId"),
    date: getString(formData, "date"),
    inclusions: parseListField(formData, "inclusions"),
    exclusions: parseListField(formData, "exclusions"),
    fee: getString(formData, "fee").replace(/[^0-9.]/g, ""),
    siteVisitRate: getString(formData, "siteVisitRate").replace(/[^0-9.]/g, ""),
    additionalHourlyRate: getString(formData, "additionalHourlyRate").replace(/[^0-9.]/g, ""),
    reportRate: getString(formData, "reportRate").replace(/[^0-9.]/g, ""),
    billingTerms: getString(formData, "billingTerms"),
    notes: getOptionalString(formData, "notes"),
  };

  const parse = QuoteSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  if (current.quoteNumber !== parse.data.quoteNumber) {
    const existing = await prisma.quote.findUnique({
      where: { quoteNumber: parse.data.quoteNumber },
      select: { id: true },
    });
    if (existing) {
      return {
        ok: false,
        message: "Please fix the errors below.",
        fieldErrors: { quoteNumber: ["A quote with this number already exists."] },
      };
    }
  }

  await prisma.quote.update({
    where: { id: quoteId },
    data: parse.data,
  });

  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${quoteId}`);
  revalidatePath(`/dashboard/projects/${parse.data.projectId}`);
  redirect(`/dashboard/quotes/${quoteId}`);
}

export async function deleteQuote(quoteId: string): Promise<void> {
  await requireAdmin();
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: {
      status: true,
      projectId: true,
      archivedAt: true,
      invoice: { select: { id: true } },
    },
  });
  if (!quote) return;
  if (quote.archivedAt) {
    throw new Error("Cannot modify — the parent project is archived.");
  }
  if (quote.status !== "draft") {
    throw new Error("Only draft quotes can be deleted.");
  }
  if (quote.invoice) {
    throw new Error("Cannot delete a quote that has been converted to an invoice.");
  }
  await prisma.quote.delete({ where: { id: quoteId } });
  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/projects/${quote.projectId}`);
  redirect("/dashboard/quotes");
}

export async function setQuoteStatus(
  quoteId: string,
  status: "draft" | "sent" | "approved" | "rejected"
): Promise<void> {
  await requireUser();

  const existing = await prisma.quote.findUnique({
    where: { id: quoteId },
    select: { archivedAt: true },
  });
  if (existing?.archivedAt) {
    throw new Error("Cannot modify — the parent project is archived.");
  }

  const data: {
    status: "draft" | "sent" | "approved" | "rejected";
    sentAt?: Date | null;
    approvedAt?: Date | null;
    rejectedAt?: Date | null;
  } = { status };

  if (status === "sent") data.sentAt = new Date();
  if (status === "approved") data.approvedAt = new Date();
  if (status === "rejected") data.rejectedAt = new Date();
  if (status === "draft") {
    data.sentAt = null;
    data.approvedAt = null;
    data.rejectedAt = null;
  }

  const updated = await prisma.quote.update({
    where: { id: quoteId },
    data,
    select: { projectId: true },
  });

  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${quoteId}`);
  revalidatePath(`/dashboard/projects/${updated.projectId}`);
}

export async function convertQuoteToInvoice(quoteId: string): Promise<void> {
  const user = await requireUser();

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { project: true, invoice: true },
  });
  if (!quote) throw new Error("Quote not found.");
  if (quote.archivedAt) {
    throw new Error("Cannot modify — the parent project is archived.");
  }
  if (quote.status !== "approved")
    throw new Error("Only approved quotes can be converted.");
  if (quote.invoice) {
    // Already converted; redirect to existing invoice
    revalidatePath(`/dashboard/quotes/${quoteId}`);
    redirect(`/dashboard/invoices/${quote.invoice.id}`);
  }

  const invoiceNumber = await nextInvoiceNumber();
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      projectId: quote.projectId,
      quoteId: quote.id,
      createdById: user.id,
      invoiceDate: new Date(),
      invoiceService: quote.project.service,
      total: quote.fee,
      status: "draft",
      lineItems: {
        create: {
          service: quote.project.service,
          phaseDescription: "Compensation",
          contractAmount: quote.fee,
          percentComplete: 100,
          invoiceAmount: quote.fee,
          sortOrder: 0,
        },
      },
    },
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${quoteId}`);
  revalidatePath(`/dashboard/projects/${quote.projectId}`);
  redirect(`/dashboard/invoices/${invoice.id}`);
}

export async function getSuggestedQuoteNumber(): Promise<string> {
  await requireUser();
  return nextQuoteNumber();
}
