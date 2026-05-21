import Link from "next/link";
import { requireAdmin } from "@/lib/auth-helpers";
import NewUserForm from "./NewUserForm";

export default async function NewUserPage() {
  await requireAdmin();

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

      <h1 className="text-2xl font-bold text-slate-900 mb-6">New User</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-xl">
        <NewUserForm />
      </div>
    </>
  );
}
