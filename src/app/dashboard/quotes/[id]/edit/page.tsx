import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateQuote } from "../../actions";
import QuoteForm from "../../QuoteForm";

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [quote, projects] = await Promise.all([
    prisma.quote.findUnique({ where: { id } }),
    prisma.project.findMany({
      orderBy: { projectNumber: "desc" },
      select: { id: true, projectNumber: true, name: true },
    }),
  ]);

  if (!quote) notFound();
  if (quote.status !== "draft") redirect(`/dashboard/quotes/${id}`);

  const action = updateQuote.bind(null, quote.id);

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/dashboard/quotes/${id}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Quote
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Quote</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        <QuoteForm
          action={action}
          projects={projects}
          cancelHref={`/dashboard/quotes/${id}`}
          submitLabel="Save Changes"
          defaults={{
            quoteNumber: quote.quoteNumber,
            projectId: quote.projectId,
            date: quote.date.toISOString().slice(0, 10),
            inclusions: quote.inclusions,
            exclusions: quote.exclusions,
            fee: quote.fee.toString(),
            billingTerms: quote.billingTerms,
            notes: quote.notes,
          }}
        />
      </div>
    </>
  );
}
