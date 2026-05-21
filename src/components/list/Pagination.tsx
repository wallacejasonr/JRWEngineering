import Link from "next/link";

export function Pagination({
  page,
  perPage,
  total,
  hrefFor,
}: {
  page: number;
  perPage: number;
  total: number;
  hrefFor: (params: { page: string }) => string;
}) {
  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
      <p>
        {total === 0
          ? "No results"
          : `Showing ${start}–${end} of ${total}`}
      </p>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link
            href={hrefFor({ page: String(page - 1) })}
            className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
          >
            ← Prev
          </Link>
        ) : (
          <span className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-300 cursor-not-allowed">
            ← Prev
          </span>
        )}
        <span className="text-xs text-slate-500 px-2">
          Page {page} of {totalPages}
        </span>
        {hasNext ? (
          <Link
            href={hrefFor({ page: String(page + 1) })}
            className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-100"
          >
            Next →
          </Link>
        ) : (
          <span className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-300 cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
