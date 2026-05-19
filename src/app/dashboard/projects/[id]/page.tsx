import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import FilesSection from "./FilesSection";

function formatMoney(value: { toNumber: () => number } | number | string): string {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? parseFloat(value)
        : value.toNumber();
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          contacts: { where: { isPrimary: true }, take: 1 },
        },
      },
      primaryContact: true,
      quotes: { orderBy: { date: "desc" } },
      invoices: { orderBy: { invoiceDate: "desc" } },
      files: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  const clientLabel =
    project.client.companyName ??
    (project.client.contacts[0]
      ? `${project.client.contacts[0].firstName} ${project.client.contacts[0].lastName}`
      : "—");

  const contactLabel = project.primaryContact
    ? `${project.primaryContact.firstName} ${project.primaryContact.lastName}`
    : "—";

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/projects"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-mono text-slate-500">#{project.projectNumber}</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{project.name}</h1>
            <div className="mt-2">
              <StatusBadge status={project.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
            >
              Edit
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="font-medium text-slate-500">Client:</span>{" "}
            <Link
              href={`/dashboard/clients/${project.clientId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {clientLabel}
            </Link>
          </div>
          <div>
            <span className="font-medium text-slate-500">Primary Contact:</span>{" "}
            <span className="text-slate-700">{contactLabel}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Service:</span>{" "}
            <span className="text-slate-700">{project.service}</span>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="font-medium text-slate-500">Location:</span>{" "}
            <span className="text-slate-700">{project.location}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Created:</span>{" "}
            <span className="text-slate-700">{formatDate(project.createdAt)}</span>
          </div>
        </div>

        {project.description && (
          <div className="mt-4 text-sm text-slate-600 whitespace-pre-wrap">
            {project.description}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-x-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Quotes</h2>
          <Link
            href={`/dashboard/quotes/new?projectId=${project.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + New Quote
          </Link>
        </div>
        {project.quotes.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500 text-center">No quotes yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Quote #</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Fee</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {project.quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-700">{quote.quoteNumber}</td>
                  <td className="px-6 py-4 text-slate-700">{formatMoney(quote.fee)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={quote.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-700">{formatDate(quote.date)}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/quotes/${quote.id}`}
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

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-x-auto">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Invoices</h2>
        </div>
        {project.invoices.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500 text-center">
            No invoices yet. Approve a quote to generate an invoice.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Invoice #</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Total</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {project.invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-700">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{formatMoney(invoice.total)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {formatDate(invoice.invoiceDate)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
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

      <FilesSection
        projectId={project.id}
        files={project.files.map((f) => ({
          id: f.id,
          name: f.name,
          originalName: f.originalName,
          sizeBytes: f.sizeBytes,
          mimeType: f.mimeType,
          createdAt: f.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
