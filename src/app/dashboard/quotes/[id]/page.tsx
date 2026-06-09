import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { StatusBadge } from "@/components/StatusBadge";
import {
  convertQuoteToInvoice,
  deleteQuote,
  setQuoteStatus,
} from "../actions";

function formatMoney(value: { toNumber: () => number }): string {
  return value.toNumber().toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const isAdmin = user.role === "admin";

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          client: {
            include: { contacts: { where: { isPrimary: true }, take: 1 } },
          },
          primaryContact: true,
        },
      },
      invoice: { select: { id: true, invoiceNumber: true } },
    },
  });

  if (!quote) notFound();

  const client = quote.project.client;
  const clientLabel =
    client.companyName ??
    (client.contacts[0]
      ? `${client.contacts[0].firstName} ${client.contacts[0].lastName}`
      : "—");
  const contactLabel = quote.project.primaryContact
    ? `${quote.project.primaryContact.firstName} ${quote.project.primaryContact.lastName}`
    : client.contacts[0]
      ? `${client.contacts[0].firstName} ${client.contacts[0].lastName}`
      : "—";

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

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-mono text-slate-500">{quote.quoteNumber}</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {quote.project.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{formatDate(quote.date)}</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={quote.status} />
              {quote.archivedAt && <StatusBadge status="archived" />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {quote.status === "draft" && !quote.archivedAt && (
              <>
                <Link
                  href={`/dashboard/quotes/${quote.id}/edit`}
                  className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
                >
                  Edit
                </Link>
                {isAdmin && (
                  <form
                    action={async () => {
                      "use server";
                      await deleteQuote(quote.id);
                    }}
                  >
                    <button className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-md font-medium">
                      Delete
                    </button>
                  </form>
                )}
              </>
            )}
            <a
              href={`/api/quotes/${quote.id}/pdf`}
              target="_blank"
              rel="noopener"
              className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
            >
              PDF
            </a>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="font-medium text-slate-500">Project:</span>{" "}
            <Link
              href={`/dashboard/projects/${quote.projectId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              #{quote.project.projectNumber}
            </Link>
          </div>
          <div>
            <span className="font-medium text-slate-500">Client:</span>{" "}
            <Link
              href={`/dashboard/clients/${client.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {clientLabel}
            </Link>
          </div>
          <div>
            <span className="font-medium text-slate-500">Contact:</span>{" "}
            <span className="text-slate-700">{contactLabel}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Inclusions</h2>
        {quote.inclusions.length === 0 ? (
          <p className="text-sm text-slate-500 italic">None listed.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700">
            {quote.inclusions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Exclusions</h2>
        {quote.exclusions.length === 0 ? (
          <p className="text-sm text-slate-500 italic">None listed.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700">
            {quote.exclusions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Fee</h2>
        <p className="text-3xl font-bold text-slate-900">{formatMoney(quote.fee)}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
          <div>
            <span className="font-medium text-slate-500">Site Visit Rate:</span>{" "}
            <span className="text-slate-900">
              {formatMoney(quote.siteVisitRate)}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-500">
              Additional Hourly Rate:
            </span>{" "}
            <span className="text-slate-900">
              {formatMoney(quote.additionalHourlyRate)}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Report Rate:</span>{" "}
            <span className="text-slate-900">
              {formatMoney(quote.reportRate)}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Typical SSI Matrix:</span>{" "}
            <span className="text-slate-700">
              {quote.includeTypicalSsiMatrix ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="font-medium text-slate-500">Concrete SSI Matrix:</span>{" "}
            <span className="text-slate-700">
              {quote.includeConcreteSsiMatrix ? "Yes" : "No"}
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3 whitespace-pre-wrap">
          {quote.billingTerms}
        </p>
      </div>

      {quote.notes && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Notes</h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}

      {quote.archivedAt ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          This quote&apos;s project is archived. {" "}
          <Link
            href={`/dashboard/projects/${quote.projectId}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Unarchive the parent project →
          </Link>{" "}
          to make changes.
        </div>
      ) : (
      <div className="flex flex-wrap gap-3">
        {quote.status === "draft" && (
          <form
            action={async () => {
              "use server";
              await setQuoteStatus(quote.id, "sent");
            }}
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Mark as Sent
            </button>
          </form>
        )}
        {quote.status === "sent" && (
          <>
            <form
              action={async () => {
                "use server";
                await setQuoteStatus(quote.id, "approved");
              }}
            >
              <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                Approve
              </button>
            </form>
            <form
              action={async () => {
                "use server";
                await setQuoteStatus(quote.id, "rejected");
              }}
            >
              <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                Reject
              </button>
            </form>
          </>
        )}
        {quote.status === "approved" && !quote.invoice && (
          <form
            action={async () => {
              "use server";
              await convertQuoteToInvoice(quote.id);
            }}
          >
            <button className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Convert to Invoice
            </button>
          </form>
        )}
        {quote.invoice && (
          <Link
            href={`/dashboard/invoices/${quote.invoice.id}`}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            View Invoice {quote.invoice.invoiceNumber} →
          </Link>
        )}
        {(quote.status === "approved" || quote.status === "rejected") && (
          <form
            action={async () => {
              "use server";
              await setQuoteStatus(quote.id, "draft");
            }}
          >
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Reset to Draft
            </button>
          </form>
        )}
      </div>
      )}
    </>
  );
}
