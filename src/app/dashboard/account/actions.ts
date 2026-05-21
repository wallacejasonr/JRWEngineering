"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { passwordSchema } from "@/lib/password";
import {
  type FormState,
  getString,
  zodErrorsToFieldErrors,
} from "@/lib/form-state";

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
});

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function updateOwnProfile(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const input = { name: getString(formData, "name") };
  const parse = ProfileSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parse.data.name },
  });

  revalidatePath("/dashboard/account");
  return { ok: true, message: "Profile updated." };
}

export async function changeOwnPassword(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const input = {
    currentPassword: getString(formData, "currentPassword"),
    newPassword: getString(formData, "newPassword"),
    confirmPassword: getString(formData, "confirmPassword"),
  };

  const parse = PasswordSchema.safeParse(input);
  if (!parse.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: zodErrorsToFieldErrors(parse.error.issues),
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { hashedPassword: true },
  });

  if (!dbUser?.hashedPassword) {
    return { ok: false, message: "No password set on account." };
  }

  const valid = await bcrypt.compare(
    parse.data.currentPassword,
    dbUser.hashedPassword
  );
  if (!valid) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: { currentPassword: ["Current password is incorrect."] },
    };
  }

  const newHash = await bcrypt.hash(parse.data.newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword: newHash },
  });

  return { ok: true, message: "Password updated." };
}
