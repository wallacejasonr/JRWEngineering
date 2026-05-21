import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditInvoiceForm from "./EditInvoiceForm";

function dateInputValue(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) notFound();
  if (invoice.archivedAt || invoice.status !== "draft") {
    redirect(`/dashboard/invoices/${id}`);
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/dashboard/invoices/${id}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Invoice
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Invoice</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        <EditInvoiceForm
          defaults={{
            invoiceId: invoice.id,
            invoiceDate: dateInputValue(invoice.invoiceDate),
            billingFrom: dateInputValue(invoice.billingFrom),
            billingTo: dateInputValue(invoice.billingTo),
            dueDate: dateInputValue(invoice.dueDate),
            invoiceService: invoice.invoiceService,
            notes: invoice.notes,
          }}
        />
      </div>
    </>
  );
}
