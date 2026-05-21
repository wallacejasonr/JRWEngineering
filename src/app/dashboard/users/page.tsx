import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function UsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      deactivatedAt: true,
      createdAt: true,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <Link
          href="/dashboard/users/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          New User
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Name
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Email
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Role
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Status
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Created
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {user.name ?? "—"}
                </td>
                <td className="px-6 py-4 text-slate-700">{user.email}</td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">
                  {user.deactivatedAt ? (
                    <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Deactivated
                    </span>
                  ) : (
                    <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-700">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RoleBadge({ role }: { role: "admin" | "user" }) {
  const styles =
    role === "admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${styles}`}
    >
      {role}
    </span>
  );
}
