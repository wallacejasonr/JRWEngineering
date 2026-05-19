import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { nextQuoteNumber } from "@/lib/numbering";
import { createQuote } from "../actions";
import QuoteForm from "../QuoteForm";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { projectId } = await searchParams;

  const [projects, suggestedNumber] = await Promise.all([
    prisma.project.findMany({
      where: { archivedAt: null },
      orderBy: { projectNumber: "desc" },
      select: { id: true, projectNumber: true, name: true },
    }),
    nextQuoteNumber(),
  ]);

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

      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Quote</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        {projects.length === 0 ? (
          <p className="text-sm text-slate-600">
            You need to create a project first.{" "}
            <Link
              href="/dashboard/projects/new"
              className="text-blue-600 hover:text-blue-800"
            >
              Create a project →
            </Link>
          </p>
        ) : (
          <QuoteForm
            action={createQuote}
            projects={projects}
            cancelHref="/dashboard/quotes"
            submitLabel="Create Quote"
            defaults={{
              quoteNumber: suggestedNumber,
              projectId: projectId ?? "",
              date: todayIsoDate(),
              inclusions: [],
              exclusions: [],
              fee: "",
              billingTerms:
                "Project will be billed 100% at time of submission.",
              notes: null,
            }}
          />
        )}
      </div>
    </>
  );
}
