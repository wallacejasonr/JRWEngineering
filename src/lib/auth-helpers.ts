import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: "admin" | "user";
};

export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  const user = session.user as { id: string; email: string; name?: string | null; role?: "admin" | "user" };
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? "user",
  };
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}
