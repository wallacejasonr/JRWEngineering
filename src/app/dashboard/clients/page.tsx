import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { unarchiveClient } from "./actions";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "archived" ? "archived" : "active";

  const where =
    view === "archived"
      ? { archivedAt: { not: null } }
      : { archivedAt: null };

  const [clients, activeCount, archivedCount] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        contacts: { where: { isPrimary: true }, take: 1 },
        _count: { select: { projects: true } },
      },
    }),
    prisma.client.count({ where: { archivedAt: null } }),
    prisma.client.count({ where: { archivedAt: { not: null } } }),
  ]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <Link
          href="/dashboard/clients/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          New Client
        </Link>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-4">
        <Link
          href="/dashboard/clients"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            view === "active"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Active ({activeCount})
        </Link>
        <Link
          href="/dashboard/clients?view=archived"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            view === "archived"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Archived ({archivedCount})
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          {view === "active" ? (
            <>
              <p className="text-slate-500 mb-4">No clients yet.</p>
              <Link
                href="/dashboard/clients/new"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Create your first client →
              </Link>
            </>
          ) : (
            <p className="text-slate-500">No archived clients.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Company Name
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Primary Contact
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Email
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Phone
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Projects
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => {
                const primary = client.contacts[0];
                return (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>
                          {client.companyName ?? (
                            <span className="text-slate-400 italic">
                              Individual
                            </span>
                          )}
                        </span>
                        {view === "archived" && (
                          <StatusBadge status="archived" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {primary ? `${primary.firstName} ${primary.lastName}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {primary?.email ?? client.email ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {primary?.phone ?? client.phone ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {client._count.projects}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/clients/${client.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                        {view === "archived" && (
                          <form
                            action={async () => {
                              "use server";
                              await unarchiveClient(client.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="text-slate-600 hover:text-slate-900 font-medium"
                            >
                              Unarchive
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
