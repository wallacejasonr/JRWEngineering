"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { generateTempPassword } from "@/lib/password";
import {
  type FormState,
  getString,
  zodErrorsToFieldErrors,
} from "@/lib/form-state";

export type UserActionResult = FormState & {
  tempPassword?: string;
};

const NewUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email").max(200),
  role: z.enum(["admin", "user"]),
});

const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  role: z.enum(["admin", "user"]),
});

async function countOtherActiveAdmins(excludeUserId: string): Promise<number> {
  return prisma.user.count({
    where: {
      role: "admin",
      deactivatedAt: null,
      NOT: { id: excludeUserId },
    },
  });
}

export async function createUser(
  _prev: UserActionResult,
  formData: FormData
): Promise<UserActionResult> {
  await requireAdmin();

  const input = {
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    role: getString(formData, "role") || "user",
  };

  const parse = NewUserSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  const tempPassword = generateTempPassword(12);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  try {
    await prisma.user.create({
      data: {
        name: parse.data.name,
        email: parse.data.email.toLowerCase(),
        role: parse.data.role,
        hashedPassword,
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        ok: false,
        message: "Please fix the errors below.",
        fieldErrors: { email: ["This email is already in use."] },
      };
    }
    throw err;
  }

  revalidatePath("/dashboard/users");
  return {
    ok: true,
    message: `User ${parse.data.email} created.`,
    tempPassword,
  };
}

export async function updateUser(
  userId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const admin = await requireAdmin();

  const input = {
    name: getString(formData, "name"),
    role: getString(formData, "role") || "user",
  };

  const parse = UpdateUserSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, deactivatedAt: true },
  });
  if (!target) {
    return { ok: false, message: "User not found." };
  }

  // Safety: cannot demote self
  if (userId === admin.id && parse.data.role !== "admin") {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: { role: ["You cannot change your own role."] },
    };
  }

  // Safety: cannot demote the last active admin
  if (
    target.role === "admin" &&
    !target.deactivatedAt &&
    parse.data.role !== "admin"
  ) {
    const others = await countOtherActiveAdmins(userId);
    if (others === 0) {
      return {
        ok: false,
        message: "Please fix the errors below.",
        fieldErrors: {
          role: ["Cannot demote the last active admin."],
        },
      };
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: parse.data.name, role: parse.data.role },
  });

  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}/edit`);
  redirect(`/dashboard/users/${userId}/edit`);
}

export async function deactivateUser(userId: string): Promise<void> {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    throw new Error("You cannot deactivate yourself.");
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, deactivatedAt: true },
  });
  if (!target) return;

  if (target.role === "admin" && !target.deactivatedAt) {
    const others = await countOtherActiveAdmins(userId);
    if (others === 0) {
      throw new Error("Cannot deactivate the last active admin.");
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { deactivatedAt: new Date() },
  });

  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}/edit`);
}

export async function reactivateUser(userId: string): Promise<void> {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { deactivatedAt: null },
  });
  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}/edit`);
}

export async function resetUserPassword(
  userId: string,
  _prev: UserActionResult,
  _formData: FormData
): Promise<UserActionResult> {
  await requireAdmin();

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!target) {
    return { ok: false, message: "User not found." };
  }

  const tempPassword = generateTempPassword(12);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { hashedPassword },
  });

  return {
    ok: true,
    message: `Password reset for ${target.email}.`,
    tempPassword,
  };
}
