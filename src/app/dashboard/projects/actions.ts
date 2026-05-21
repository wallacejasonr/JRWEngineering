"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { nextProjectNumber } from "@/lib/numbering";
import {
  type FormState,
  getOptionalString,
  getString,
  zodErrorsToFieldErrors,
} from "@/lib/form-state";

const ProjectNumberRegex = /^\d{2}-\d{3}$/;

const ProjectSchema = z.object({
  projectNumber: z
    .string()
    .regex(ProjectNumberRegex, "Project number must look like YY-NNN (e.g. 26-001)"),
  name: z.string().min(1, "Name is required").max(200),
  clientId: z.string().min(1, "Client is required"),
  primaryContactId: z.string().nullable(),
  service: z.string().min(1, "Service is required").max(200),
  description: z.string().max(5000).nullable(),
  location: z.string().min(1, "Location is required").max(500),
  status: z.enum(["active", "completed", "on_hold", "archived"]),
});

export async function createProject(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const input = {
    projectNumber: getString(formData, "projectNumber"),
    name: getString(formData, "name"),
    clientId: getString(formData, "clientId"),
    primaryContactId: getOptionalString(formData, "primaryContactId"),
    service: getString(formData, "service"),
    description: getOptionalString(formData, "description"),
    location: getString(formData, "location"),
    status: getString(formData, "status") || "active",
  };

  const parse = ProjectSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  const existing = await prisma.project.findUnique({
    where: { projectNumber: parse.data.projectNumber },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: { projectNumber: ["A project with this number already exists."] },
    };
  }

  // If no primary contact selected, default to client's primary contact
  let primaryContactId = parse.data.primaryContactId;
  if (!primaryContactId) {
    const primary = await prisma.contact.findFirst({
      where: { clientId: parse.data.clientId, isPrimary: true },
      select: { id: true },
    });
    primaryContactId = primary?.id ?? null;
  }

  const created = await prisma.project.create({
    data: {
      projectNumber: parse.data.projectNumber,
      name: parse.data.name,
      clientId: parse.data.clientId,
      primaryContactId,
      service: parse.data.service,
      description: parse.data.description,
      location: parse.data.location,
      status: parse.data.status,
      createdById: user.id,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/clients/${parse.data.clientId}`);
  redirect(`/dashboard/projects/${created.id}`);
}

export async function updateProject(
  projectId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const input = {
    projectNumber: getString(formData, "projectNumber"),
    name: getString(formData, "name"),
    clientId: getString(formData, "clientId"),
    primaryContactId: getOptionalString(formData, "primaryContactId"),
    service: getString(formData, "service"),
    description: getOptionalString(formData, "description"),
    location: getString(formData, "location"),
    status: getString(formData, "status") || "active",
  };

  const parse = ProjectSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  // Check number uniqueness (if changed)
  const current = await prisma.project.findUnique({
    where: { id: projectId },
    select: { projectNumber: true, clientId: true },
  });
  if (current && current.projectNumber !== parse.data.projectNumber) {
    const existing = await prisma.project.findUnique({
      where: { projectNumber: parse.data.projectNumber },
      select: { id: true },
    });
    if (existing) {
      return {
        ok: false,
        message: "Please fix the errors below.",
        fieldErrors: { projectNumber: ["A project with this number already exists."] },
      };
    }
  }

  await prisma.project.update({
    where: { id: projectId },
    data: parse.data,
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  if (current?.clientId) revalidatePath(`/dashboard/clients/${current.clientId}`);
  revalidatePath(`/dashboard/clients/${parse.data.clientId}`);
  redirect(`/dashboard/projects/${projectId}`);
}

export async function archiveProject(projectId: string): Promise<void> {
  await requireUser();

  const blockers = await prisma.invoice.findMany({
    where: {
      projectId,
      status: { notIn: ["paid", "cancelled"] },
    },
    select: { id: true, invoiceNumber: true, status: true },
    orderBy: { invoiceNumber: "desc" },
  });

  if (blockers.length > 0) {
    const list = blockers
      .map((i) => `${i.invoiceNumber} (${i.status})`)
      .join("; ");
    throw new Error(
      `Cannot archive project. The following invoices are still unpaid: ${list}`
    );
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.project.update({
      where: { id: projectId },
      data: { status: "archived", archivedAt: now },
    }),
    prisma.quote.updateMany({
      where: { projectId, archivedAt: null },
      data: { archivedAt: now },
    }),
    prisma.invoice.updateMany({
      where: { projectId, archivedAt: null },
      data: { archivedAt: now },
    }),
  ]);

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard/quotes");
  revalidatePath("/dashboard/invoices");
  redirect(`/dashboard/projects/${projectId}`);
}

export async function unarchiveProject(projectId: string): Promise<void> {
  await requireUser();

  await prisma.$transaction([
    prisma.project.update({
      where: { id: projectId },
      data: { status: "active", archivedAt: null },
    }),
    prisma.quote.updateMany({
      where: { projectId, archivedAt: { not: null } },
      data: { archivedAt: null },
    }),
    prisma.invoice.updateMany({
      where: { projectId, archivedAt: { not: null } },
      data: { archivedAt: null },
    }),
  ]);

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard/quotes");
  revalidatePath("/dashboard/invoices");
}

export async function setProjectStatus(
  projectId: string,
  status: "active" | "completed" | "on_hold" | "archived"
): Promise<void> {
  await requireUser();
  await prisma.project.update({
    where: { id: projectId },
    data: {
      status,
      archivedAt: status === "archived" ? new Date() : null,
    },
  });
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function getSuggestedProjectNumber(): Promise<string> {
  await requireUser();
  return nextProjectNumber();
}
