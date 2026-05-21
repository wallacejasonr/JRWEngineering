import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import EditUserForm from "./EditUserForm";
import ResetPasswordButton from "./ResetPasswordButton";
import { deactivateUser, reactivateUser } from "../../actions";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      deactivatedAt: true,
    },
  });
  if (!user) notFound();

  const isSelf = admin.id === user.id;
  const otherActiveAdmins =
    user.role === "admin" && !user.deactivatedAt
      ? await prisma.user.count({
          where: {
            role: "admin",
            deactivatedAt: null,
            NOT: { id: user.id },
          },
        })
      : 1;
  const isLastActiveAdmin =
    user.role === "admin" && !user.deactivatedAt && otherActiveAdmins === 0;

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/users"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Users
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit User</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-xl mb-6">
        <EditUserForm
          user={user}
          isSelf={isSelf}
          isLastActiveAdmin={isLastActiveAdmin}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-xl mb-6">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
          Password
        </h2>
        <ResetPasswordButton userId={user.id} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-xl">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
          Account Status
        </h2>
        {user.deactivatedAt ? (
          <>
            <p className="text-sm text-slate-600 mb-3">
              This account is deactivated and cannot sign in.
            </p>
            <form
              action={async () => {
                "use server";
                await reactivateUser(user.id);
              }}
            >
              <button
                type="submit"
                className="text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-md font-medium"
              >
                Reactivate
              </button>
            </form>
          </>
        ) : isSelf ? (
          <p className="text-sm text-slate-500">
            You cannot deactivate yourself.
          </p>
        ) : isLastActiveAdmin ? (
          <p className="text-sm text-slate-500">
            This is the last active admin and cannot be deactivated.
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-3">
              Deactivating prevents this user from signing in. Their existing
              records (projects, quotes, invoices) remain attributed to them.
            </p>
            <form
              action={async () => {
                "use server";
                await deactivateUser(user.id);
              }}
            >
              <button
                type="submit"
                className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-md font-medium"
              >
                Deactivate
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
