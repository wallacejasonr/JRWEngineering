import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";

function formatMoney(value: { toNumber: () => number }): string {
  return value.toNumber().toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { invoiceDate: "desc" },
    include: {
      project: {
        include: {
          client: { include: { contacts: { where: { isPrimary: true }, take: 1 } } },
        },
      },
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">No invoices yet.</p>
          <p className="text-sm text-slate-400">
            Invoices are created by converting approved quotes.
          </p>
          <Link
            href="/dashboard/quotes"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Go to Quotes →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Invoice #</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Project</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Client</th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600">Total</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => {
                const client = invoice.project.client;
                const clientLabel =
                  client.companyName ??
                  (client.contacts[0]
                    ? `${client.contacts[0].firstName} ${client.contacts[0].lastName}`
                    : "—");
                return (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-900">{invoice.project.name}</td>
                    <td className="px-6 py-4 text-slate-700">{clientLabel}</td>
                    <td className="px-6 py-4 text-right text-slate-700 font-medium">
                      {formatMoney(invoice.total)}
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
