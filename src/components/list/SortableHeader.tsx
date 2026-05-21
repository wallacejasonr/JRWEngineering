import Link from "next/link";
import type { SortDir } from "@/lib/list-params";
import { nextSortDir } from "@/lib/list-params";

export function SortableHeader({
  label,
  columnKey,
  currentSort,
  currentDir,
  hrefFor,
  defaultDir = "asc",
  align = "left",
}: {
  label: string;
  columnKey: string;
  currentSort: string;
  currentDir: SortDir;
  hrefFor: (params: { sort: string; dir: SortDir; page: string }) => string;
  defaultDir?: SortDir;
  align?: "left" | "right";
}) {
  const isActive = currentSort === columnKey;
  const dir = nextSortDir(currentSort, currentDir, columnKey, defaultDir);
  const href = hrefFor({ sort: columnKey, dir, page: "1" });
  const alignClass = align === "right" ? "text-right" : "text-left";

  return (
    <th
      className={`${alignClass} px-6 py-3 font-semibold text-slate-600`}
    >
      <Link
        href={href}
        className={`inline-flex items-center gap-1 hover:text-slate-900 ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        <span>{label}</span>
        <SortArrow active={isActive} dir={currentDir} />
      </Link>
    </th>
  );
}

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return (
      <span aria-hidden="true" className="text-slate-300 text-xs">
        ↕
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="text-blue-600 text-xs">
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
}
