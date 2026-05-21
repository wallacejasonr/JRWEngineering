import Link from "next/link";

export function SearchForm({
  action,
  q,
  placeholder = "Search…",
  preserved = {},
}: {
  action: string;
  q: string;
  placeholder?: string;
  preserved?: Record<string, string | undefined>;
}) {
  const preservedEntries = Object.entries(preserved).filter(
    ([, v]) => v !== undefined && v !== ""
  ) as [string, string][];

  const clearParams: Record<string, string> = {};
  for (const [k, v] of preservedEntries) clearParams[k] = v;
  const clearQs = new URLSearchParams(clearParams).toString();
  const clearHref = clearQs ? `${action}?${clearQs}` : action;

  return (
    <form action={action} method="GET" className="flex items-center gap-2 mb-4">
      {preservedEntries.map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <input
        type="text"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        className="flex-1 max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
      <button
        type="submit"
        className="bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium px-3 py-2 rounded-md"
      >
        Search
      </button>
      {q && (
        <Link
          href={clearHref}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Clear
        </Link>
      )}
    </form>
  );
}
