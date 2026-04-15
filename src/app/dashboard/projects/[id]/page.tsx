import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Placeholder data
  const project = {
    id,
    number: "25-063",
    name: "Multi-Family Structural",
    status: "active",
    client: "Sandbox Projects",
    contact: "Josh Sandbox",
    service: "Mechanical Support Design",
    location: "1234 Elm St, Denver, CO 80202",
    createdAt: "2025-03-15",
  };

  const quotes = [
    {
      id: "q1",
      number: "Q-25-001",
      fee: "$8,500.00",
      status: "approved",
      date: "2025-03-16",
    },
  ];

  const invoices = [
    {
      id: "i1",
      number: "JRWE-25-001",
      total: "$4,250.00",
      status: "paid",
      date: "2025-04-01",
    },
  ];

  const files = [
    { name: "structural-calcs-v1.pdf", size: "2.4 MB", date: "2025-03-20" },
    { name: "foundation-plan.dwg", size: "5.1 MB", date: "2025-03-18" },
  ];

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    completed: "bg-slate-100 text-slate-600",
    on_hold: "bg-yellow-100 text-yellow-700",
    archived: "bg-slate-100 text-slate-500",
    draft: "bg-blue-100 text-blue-700",
    sent: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
  };

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

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-mono text-slate-500">
              #{project.number}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {project.name}
            </h1>
          </div>
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${statusStyles[project.status] ?? ""}`}
          >
            {project.status.replace("_", " ")}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-500">Client:</span>{" "}
            <span className="text-slate-700">{project.client}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">
              Primary Contact:
            </span>{" "}
            <span className="text-slate-700">{project.contact}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Service:</span>{" "}
            <span className="text-slate-700">{project.service}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Location:</span>{" "}
            <span className="text-slate-700">{project.location}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Created:</span>{" "}
            <span className="text-slate-700">{project.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Quotes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-x-auto">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Quotes</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Quote #
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

      {/* Invoices Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-x-auto">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Invoices</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Invoice #
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
                <td className="px-6 py-4 text-slate-700">{invoice.total}</td>
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

      {/* Files Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Files</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {files.map((file) => (
            <li
              key={file.name}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">{file.size}</p>
              </div>
              <span className="text-xs text-slate-400">{file.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
