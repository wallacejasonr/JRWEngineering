"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import {
  type FormState,
  getOptionalString,
  getString,
  zodErrorsToFieldErrors,
} from "@/lib/form-state";

const ClientSchema = z.object({
  companyName: z.string().max(200).nullable(),
  email: z.string().email().max(200).nullable(),
  phone: z.string().max(50).nullable(),
  address: z.string().max(200).nullable(),
  city: z.string().max(100).nullable(),
  state: z.string().max(50).nullable(),
  zip: z.string().max(20).nullable(),
  notes: z.string().max(5000).nullable(),
});

const ContactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email().max(200).nullable(),
  phone: z.string().max(50).nullable(),
  title: z.string().max(100).nullable(),
});

export async function createClient(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const clientInput = {
    companyName: getOptionalString(formData, "companyName"),
    email: getOptionalString(formData, "email"),
    phone: getOptionalString(formData, "phone"),
    address: getOptionalString(formData, "address"),
    city: getOptionalString(formData, "city"),
    state: getOptionalString(formData, "state"),
    zip: getOptionalString(formData, "zip"),
    notes: getOptionalString(formData, "notes"),
  };

  const contactInput = {
    firstName: getString(formData, "firstName"),
    lastName: getString(formData, "lastName"),
    email: getOptionalString(formData, "contactEmail") ?? clientInput.email,
    phone: getOptionalString(formData, "contactPhone") ?? clientInput.phone,
    title: getOptionalString(formData, "contactTitle"),
  };

  const clientParse = ClientSchema.safeParse(clientInput);
  const contactParse = ContactSchema.safeParse(contactInput);

  if (!clientParse.success || !contactParse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: {
        ...(clientParse.success ? {} : zodErrorsToFieldErrors(clientParse.error.issues)),
        ...(contactParse.success ? {} : zodErrorsToFieldErrors(contactParse.error.issues)),
      },
    };
  }

  const created = await prisma.client.create({
    data: {
      ...clientParse.data,
      contacts: {
        create: {
          ...contactParse.data,
          isPrimary: true,
        },
      },
    },
  });

  revalidatePath("/dashboard/clients");
  redirect(`/dashboard/clients/${created.id}`);
}

export async function updateClient(
  clientId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const input = {
    companyName: getOptionalString(formData, "companyName"),
    email: getOptionalString(formData, "email"),
    phone: getOptionalString(formData, "phone"),
    address: getOptionalString(formData, "address"),
    city: getOptionalString(formData, "city"),
    state: getOptionalString(formData, "state"),
    zip: getOptionalString(formData, "zip"),
    notes: getOptionalString(formData, "notes"),
  };

  const parse = ClientSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  await prisma.client.update({
    where: { id: clientId },
    data: parse.data,
  });

  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${clientId}`);
  redirect(`/dashboard/clients/${clientId}`);
}

export async function archiveClient(clientId: string): Promise<void> {
  await requireUser();

  const blockers = await prisma.project.findMany({
    where: { clientId, status: { not: "archived" } },
    select: { projectNumber: true, name: true },
    orderBy: { projectNumber: "desc" },
  });

  if (blockers.length > 0) {
    const list = blockers.map((p) => `${p.projectNumber} ${p.name}`).join("; ");
    throw new Error(
      `Cannot archive client. The following projects must be archived first: ${list}`
    );
  }

  await prisma.client.update({
    where: { id: clientId },
    data: { archivedAt: new Date() },
  });
  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function unarchiveClient(clientId: string): Promise<void> {
  await requireUser();
  await prisma.client.update({
    where: { id: clientId },
    data: { archivedAt: null },
  });
  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function addContact(
  clientId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const input = {
    firstName: getString(formData, "firstName"),
    lastName: getString(formData, "lastName"),
    email: getOptionalString(formData, "email"),
    phone: getOptionalString(formData, "phone"),
    title: getOptionalString(formData, "title"),
  };

  const parse = ContactSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  await prisma.contact.create({
    data: { ...parse.data, clientId, isPrimary: false },
  });

  revalidatePath(`/dashboard/clients/${clientId}`);
  return { ok: true, message: "Contact added." };
}

export async function deleteContact(
  clientId: string,
  contactId: string
): Promise<void> {
  await requireUser();

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { isPrimary: true, clientId: true },
  });
  if (!contact || contact.clientId !== clientId) return;
  if (contact.isPrimary) {
    throw new Error("Cannot delete the primary contact.");
  }

  await prisma.contact.delete({ where: { id: contactId } });
  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function setPrimaryContact(
  clientId: string,
  contactId: string
): Promise<void> {
  await requireUser();
  await prisma.$transaction([
    prisma.contact.updateMany({
      where: { clientId },
      data: { isPrimary: false },
    }),
    prisma.contact.update({
      where: { id: contactId },
      data: { isPrimary: true },
    }),
  ]);
  revalidatePath(`/dashboard/clients/${clientId}`);
}
