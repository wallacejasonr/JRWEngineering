import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import LineItemsSection from "./LineItemsSection";
import { deleteInvoice, setInvoiceStatus } from "../actions";

function formatMoney(value: { toNumber: () => number }): string {
  return value.toNumber().toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
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
      quote: { select: { id: true, quoteNumber: true } },
      lineItems: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!invoice) notFound();

  const client = invoice.project.client;
  const clientLabel =
    client.companyName ??
    (client.contacts[0]
      ? `${client.contacts[0].firstName} ${client.contacts[0].lastName}`
      : "—");
  const contactLabel = invoice.project.primaryContact
    ? `${invoice.project.primaryContact.firstName} ${invoice.project.primaryContact.lastName}`
    : client.contacts[0]
      ? `${client.contacts[0].firstName} ${client.contacts[0].lastName}`
      : "—";

  const editable = invoice.status === "draft";

  const lineItemsForClient = invoice.lineItems.map((item) => ({
    id: item.id,
    service: item.service,
    phaseDescription: item.phaseDescription,
    contractAmount: item.contractAmount.toString(),
    percentComplete: item.percentComplete.toString(),
    invoiceAmount: item.invoiceAmount.toString(),
  }));

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

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-mono text-slate-500">{invoice.invoiceNumber}</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Invoice</h1>
            <p className="text-sm text-slate-500 mt-1">
              {formatDate(invoice.invoiceDate)}
            </p>
            <div className="mt-2">
              <StatusBadge status={invoice.status} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editable && (
              <>
                <Link
                  href={`/dashboard/invoices/${invoice.id}/edit`}
                  className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
                >
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteInvoice(invoice.id);
                  }}
                >
                  <button className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-md font-medium">
                    Delete
                  </button>
                </form>
              </>
            )}
            <a
              href={`/api/invoices/${invoice.id}/pdf`}
              target="_blank"
              rel="noopener"
              className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
            >
              PDF
            </a>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="font-medium text-slate-500">Project:</span>{" "}
            <Link
              href={`/dashboard/projects/${invoice.projectId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              #{invoice.project.projectNumber}
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
          <div>
            <span className="font-medium text-slate-500">Service:</span>{" "}
            <span className="text-slate-700">{invoice.invoiceService}</span>
          </div>
          {(invoice.billingFrom || invoice.billingTo) && (
            <div className="sm:col-span-2">
              <span className="font-medium text-slate-500">Billing Period:</span>{" "}
              <span className="text-slate-700">
                {formatDate(invoice.billingFrom)} &mdash; {formatDate(invoice.billingTo)}
              </span>
            </div>
          )}
          {invoice.dueDate && (
            <div>
              <span className="font-medium text-slate-500">Due:</span>{" "}
              <span className="text-slate-700">{formatDate(invoice.dueDate)}</span>
            </div>
          )}
          {invoice.quote && (
            <div>
              <span className="font-medium text-slate-500">From Quote:</span>{" "}
              <Link
                href={`/dashboard/quotes/${invoice.quote.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {invoice.quote.quoteNumber}
              </Link>
            </div>
          )}
        </div>
      </div>

      <LineItemsSection
        invoiceId={invoice.id}
        lineItems={lineItemsForClient}
        total={invoice.total.toString()}
        editable={editable}
      />

      {invoice.notes && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Notes</h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {invoice.status === "draft" && (
          <form
            action={async () => {
              "use server";
              await setInvoiceStatus(invoice.id, "sent");
            }}
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Mark as Sent
            </button>
          </form>
        )}
        {(invoice.status === "sent" || invoice.status === "overdue") && (
          <form
            action={async () => {
              "use server";
              await setInvoiceStatus(invoice.id, "paid");
            }}
          >
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Mark Paid
            </button>
          </form>
        )}
        {invoice.status === "sent" && (
          <form
            action={async () => {
              "use server";
              await setInvoiceStatus(invoice.id, "overdue");
            }}
          >
            <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Mark Overdue
            </button>
          </form>
        )}
        {invoice.status !== "paid" && invoice.status !== "cancelled" && (
          <form
            action={async () => {
              "use server";
              await setInvoiceStatus(invoice.id, "cancelled");
            }}
          >
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Cancel Invoice
            </button>
          </form>
        )}
        {invoice.status !== "draft" && invoice.status !== "paid" && (
          <form
            action={async () => {
              "use server";
              await setInvoiceStatus(invoice.id, "draft");
            }}
          >
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-md transition-colors">
              Reset to Draft
            </button>
          </form>
        )}
      </div>
    </>
  );
}
