import Link from "next/link";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Placeholder data
  const invoice = {
    id,
    number: "JRWE-25-001",
    status: "paid",
    date: "April 1, 2025",
    project: { number: "25-063", name: "Multi-Family Structural" },
    client: "Sandbox Projects",
    contact: "Josh Sandbox",
    invoiceService: "Structural Engineering",
    billingFrom: "March 15, 2025",
    billingTo: "March 31, 2025",
    notes: "Payment received via check #4521. Thank you.",
    lineItems: [
      {
        service: "Structural Calcs",
        phase: "Design Phase",
        contractAmount: "$5,000.00",
        percentComplete: "50%",
        invoiceAmount: "$2,500.00",
      },
      {
        service: "Construction Docs",
        phase: "Documentation",
        contractAmount: "$3,500.00",
        percentComplete: "50%",
        invoiceAmount: "$1,750.00",
      },
    ],
    total: "$4,250.00",
  };

  const statusStyles: Record<string, string> = {
    draft: "bg-blue-100 text-blue-700",
    sent: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-500",
  };

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/invoices"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Invoices
        </Link>
      </div>

      {/* Invoice Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-mono text-slate-500">
              {invoice.number}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Invoice
            </h1>
            <p className="text-sm text-slate-500 mt-1">{invoice.date}</p>
          </div>
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${statusStyles[invoice.status] ?? ""}`}
          >
            {invoice.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-500">Project:</span>{" "}
            <span className="text-slate-700">
              #{invoice.project.number} {invoice.project.name}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Client:</span>{" "}
            <span className="text-slate-700">{invoice.client}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Contact:</span>{" "}
            <span className="text-slate-700">{invoice.contact}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Service:</span>{" "}
            <span className="text-slate-700">{invoice.invoiceService}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="font-medium text-slate-500">
              Billing Period:
            </span>{" "}
            <span className="text-slate-700">
              {invoice.billingFrom} &mdash; {invoice.billingTo}
            </span>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-x-auto">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Line Items</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Service
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Phase Description
              </th>
              <th className="text-right px-6 py-3 font-semibold text-slate-600">
                Contract Amt
              </th>
              <th className="text-right px-6 py-3 font-semibold text-slate-600">
                % Complete
              </th>
              <th className="text-right px-6 py-3 font-semibold text-slate-600">
                Invoice Amt
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.lineItems.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900">{item.service}</td>
                <td className="px-6 py-4 text-slate-700">{item.phase}</td>
                <td className="px-6 py-4 text-right text-slate-700">
                  {item.contractAmount}
                </td>
                <td className="px-6 py-4 text-right text-slate-700">
                  {item.percentComplete}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  {item.invoiceAmount}
                </td>
              </tr>
            ))}
            {/* Total row */}
            <tr className="bg-slate-50 font-semibold">
              <td colSpan={4} className="px-6 py-4 text-right text-slate-900">
                Total
              </td>
              <td className="px-6 py-4 text-right text-slate-900">
                {invoice.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Notes</h2>
          <p className="text-sm text-slate-700">{invoice.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
          Send
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
          Mark Paid
        </button>
      </div>
    </>
  );
}
