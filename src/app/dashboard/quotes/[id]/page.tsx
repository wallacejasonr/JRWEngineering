import Link from "next/link";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Placeholder data
  const quote = {
    id,
    number: "Q-25-001",
    status: "approved",
    date: "March 16, 2025",
    project: { number: "25-063", name: "Multi-Family Structural" },
    client: "Sandbox Projects",
    contact: "Josh Sandbox",
    inclusions: [
      "Structural analysis and design of wood-framed multi-family building",
      "Foundation design including spread footings and grade beams",
      "Lateral force resisting system design",
      "Structural construction documents (plans and details)",
      "One round of plan check response",
    ],
    exclusions: [
      "Geotechnical engineering",
      "Civil engineering and site design",
      "Special inspections",
      "Construction administration beyond plan check response",
    ],
    fee: "$8,500.00",
    billingTerms:
      "Project will be billed 50% at submission of construction documents and 50% upon plan check approval.",
  };

  const statusStyles: Record<string, string> = {
    draft: "bg-blue-100 text-blue-700",
    sent: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/quotes"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Quotes
        </Link>
      </div>

      {/* Quote Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-mono text-slate-500">{quote.number}</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {quote.project.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{quote.date}</p>
          </div>
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${statusStyles[quote.status] ?? ""}`}
          >
            {quote.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-500">Project:</span>{" "}
            <span className="text-slate-700">
              #{quote.project.number} {quote.project.name}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Client:</span>{" "}
            <span className="text-slate-700">{quote.client}</span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Contact:</span>{" "}
            <span className="text-slate-700">{quote.contact}</span>
          </div>
        </div>
      </div>

      {/* Inclusions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Inclusions
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700">
          {quote.inclusions.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Exclusions */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Exclusions
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700">
          {quote.exclusions.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Fee */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Fee</h2>
        <p className="text-3xl font-bold text-slate-900">{quote.fee}</p>
        <p className="text-sm text-slate-500 mt-3">{quote.billingTerms}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
          Send
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
          Approve
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
          Reject
        </button>
        <button className="bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
          Convert to Invoice
        </button>
      </div>
    </>
  );
}
