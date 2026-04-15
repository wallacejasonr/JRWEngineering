import Link from "next/link";

export default function QuotesPage() {
  const quotes = [
    {
      id: "1",
      number: "Q-25-001",
      project: "Multi-Family Structural",
      client: "Sandbox Projects",
      fee: "$8,500.00",
      status: "approved",
      date: "2025-03-16",
    },
    {
      id: "2",
      number: "Q-25-002",
      project: "Townhome Foundation Review",
      client: "Sandbox Projects",
      fee: "$3,200.00",
      status: "sent",
      date: "2025-03-20",
    },
    {
      id: "3",
      number: "Q-25-003",
      project: "Commercial Remodel Structural",
      client: "Origin Design and Tech",
      fee: "$12,000.00",
      status: "draft",
      date: "2025-04-01",
    },
  ];

  const statusStyles: Record<string, string> = {
    draft: "bg-blue-100 text-blue-700",
    sent: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
        <Link
          href="/dashboard/quotes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          New Quote
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Quote #
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Project
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Client
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Fee
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
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-700">
                  {quote.number}
                </td>
                <td className="px-6 py-4 text-slate-900">{quote.project}</td>
                <td className="px-6 py-4 text-slate-700">{quote.client}</td>
                <td className="px-6 py-4 text-slate-700">{quote.fee}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyles[quote.status] ?? ""}`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700">{quote.date}</td>
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
      </div>
    </>
  );
}
