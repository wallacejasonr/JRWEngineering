import Link from "next/link";

export default function InvoicesPage() {
  const invoices = [
    {
      id: "1",
      number: "JRWE-25-001",
      project: "Multi-Family Structural",
      client: "Sandbox Projects",
      service: "Structural Engineering",
      total: "$4,250.00",
      status: "paid",
      date: "2025-04-01",
    },
    {
      id: "2",
      number: "JRWE-25-002",
      project: "Townhome Foundation Review",
      client: "Sandbox Projects",
      service: "Structural Engineering",
      total: "$3,200.00",
      status: "sent",
      date: "2025-04-05",
    },
    {
      id: "3",
      number: "JRWE-25-003",
      project: "Commercial Remodel Structural",
      client: "Origin Design and Tech",
      service: "Structural Engineering",
      total: "$6,000.00",
      status: "draft",
      date: "2025-04-10",
    },
    {
      id: "4",
      number: "JRWE-24-015",
      project: "Office Tenant Improvement",
      client: "Origin Design and Tech",
      service: "MEP Coordination",
      total: "$2,800.00",
      status: "overdue",
      date: "2025-02-15",
    },
  ];

  const statusStyles: Record<string, string> = {
    draft: "bg-blue-100 text-blue-700",
    sent: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-500",
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Invoice #
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Project
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Client
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Service
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Total
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Status
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Date
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-700">
                  {invoice.number}
                </td>
                <td className="px-6 py-4 text-slate-900">{invoice.project}</td>
                <td className="px-6 py-4 text-slate-700">{invoice.client}</td>
                <td className="px-6 py-4 text-slate-700">{invoice.service}</td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {invoice.total}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyles[invoice.status] ?? ""}`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700">{invoice.date}</td>
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
      </div>
    </>
  );
}
