import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import ContactsSection from "./ContactsSection";
import { archiveClient, unarchiveClient } from "../actions";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contacts: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
      projects: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          projectNumber: true,
          name: true,
          status: true,
        },
      },
    },
  });

  if (!client) notFound();

  const displayName =
    client.companyName ??
    (client.contacts[0]
      ? `${client.contacts[0].firstName} ${client.contacts[0].lastName}`
      : "(no name)");

  const addressLine = [
    client.address,
    [client.city, client.state].filter(Boolean).join(", "),
    client.zip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/clients"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Clients
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
            {client.archivedAt && (
              <p className="mt-1 text-sm text-slate-500 italic">Archived</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/clients/${client.id}/edit`}
              className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
            >
              Edit
            </Link>
            {client.archivedAt ? (
              <form
                action={async () => {
                  "use server";
                  await unarchiveClient(client.id);
                }}
              >
                <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium">
                  Unarchive
                </button>
              </form>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await archiveClient(client.id);
                }}
              >
                <button className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-md font-medium">
                  Archive
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
          {client.email && (
            <div>
              <span className="font-medium text-slate-500">Email:</span>{" "}
              {client.email}
            </div>
          )}
          {client.phone && (
            <div>
              <span className="font-medium text-slate-500">Phone:</span>{" "}
              {client.phone}
            </div>
          )}
          {addressLine && (
            <div className="sm:col-span-2">
              <span className="font-medium text-slate-500">Address:</span>{" "}
              {addressLine}
            </div>
          )}
        </div>
        {client.notes && (
          <p className="mt-4 text-sm text-slate-500 whitespace-pre-wrap">
            {client.notes}
          </p>
        )}
      </div>

      <ContactsSection clientId={client.id} contacts={client.contacts} />

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
          <Link
            href={`/dashboard/projects/new?clientId=${client.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + New Project
          </Link>
        </div>
        {client.projects.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500 text-center">
            No projects yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Project #
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {client.projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-700">
                    {project.projectNumber}
                  </td>
                  <td className="px-6 py-4 text-slate-900">{project.name}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
