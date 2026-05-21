export const PER_PAGE = 50;

export type SortDir = "asc" | "desc";

export type ListSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type ParsedListParams<TSortKey extends string> = {
  q: string;
  sort: TSortKey;
  dir: SortDir;
  page: number;
  perPage: number;
  skip: number;
  take: number;
};

function firstString(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export function parseListParams<TSortKey extends string>(
  raw: ListSearchParams,
  config: {
    sortKeys: readonly TSortKey[];
    defaultSort: TSortKey;
    defaultDir?: SortDir;
    perPage?: number;
  }
): ParsedListParams<TSortKey> {
  const q = (firstString(raw.q) ?? "").trim();

  const rawSort = firstString(raw.sort);
  const sort = (config.sortKeys as readonly string[]).includes(rawSort ?? "")
    ? (rawSort as TSortKey)
    : config.defaultSort;

  const rawDir = firstString(raw.dir);
  const dir: SortDir =
    rawDir === "asc"
      ? "asc"
      : rawDir === "desc"
        ? "desc"
        : (config.defaultDir ?? "desc");

  const rawPage = parseInt(firstString(raw.page) ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const perPage = config.perPage ?? PER_PAGE;

  return {
    q,
    sort,
    dir,
    page,
    perPage,
    skip: (page - 1) * perPage,
    take: perPage,
  };
}

/**
 * Build a URL by merging current params with overrides. Pass null/undefined/""
 * to remove a key.
 */
export function buildListUrl(
  pathname: string,
  current: Record<string, string | undefined>,
  overrides: Record<string, string | null | undefined> = {}
): string {
  const merged: Record<string, string> = {};
  for (const [k, v] of Object.entries(current)) {
    if (v !== undefined && v !== "") merged[k] = v;
  }
  for (const [k, v] of Object.entries(overrides)) {
    if (v === null || v === undefined || v === "") {
      delete merged[k];
    } else {
      merged[k] = v;
    }
  }
  const qs = new URLSearchParams(merged).toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function nextSortDir(
  currentSort: string,
  currentDir: SortDir,
  columnKey: string,
  defaultDirForColumn: SortDir = "asc"
): SortDir {
  if (currentSort !== columnKey) return defaultDirForColumn;
  return currentDir === "asc" ? "desc" : "asc";
}
