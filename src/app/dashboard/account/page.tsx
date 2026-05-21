import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";

export default async function AccountPage() {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, role: true },
  });

  if (!user) {
    return (
      <div className="text-sm text-slate-500">Account not found.</div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Profile
          </h2>
          <ProfileForm
            initialName={user.name ?? ""}
            email={user.email}
            role={user.role}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Change Password
          </h2>
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
