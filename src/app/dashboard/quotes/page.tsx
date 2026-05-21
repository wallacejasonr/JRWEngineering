import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { SortableHeader } from "@/components/list/SortableHeader";
import { SearchForm } from "@/components/list/SearchForm";
import { Pagination } from "@/components/list/Pagination";
import {
  buildListUrl,
  parseListParams,
  type ListSearchParams,
  type SortDir,
} from "@/lib/list-params";

function formatMoney(value: { toNumber: () => number }): string {
  return value.toNumber().toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const SORT_KEYS = [
  "quoteNumber",
  "project",
  "client",
  "fee",
  "status",
  "date",
] as const;
type SortKey = (typeof SORT_KEYS)[number];

function orderByFor(
  sort: SortKey,
  dir: SortDir
): Prisma.QuoteOrderByWithRelationInput[] {
  switch (sort) {
    case "quoteNumber":
      return [{ quoteNumber: dir }];
    case "project":
      return [{ project: { name: dir } }];
    case "client":
      return [{ project: { client: { companyName: { sort: dir, nulls: "last" } } } }];
    case "fee":
      return [{ fee: dir }];
    case "status":
      return [{ status: dir }];
    case "date":
    default:
      return [{ date: dir }];
  }
}

function searchWhere(q: string): Prisma.QuoteWhereInput {
  return {
    OR: [
      { quoteNumber: { contains: q, mode: "insensitive" } },
      { project: { name: { contains: q, mode: "insensitive" } } },
      {
        project: {
          client: { companyName: { contains: q, mode: "insensitive" } },
        },
      },
    ],
  };
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const raw = await searchParams;
  const viewRaw = typeof raw.view === "string" ? raw.view : undefined;
  const view = viewRaw === "archived" ? "archived" : "active";

  const list = parseListParams<SortKey>(raw, {
    sortKeys: SORT_KEYS,
    defaultSort: "date",
    defaultDir: "desc",
  });

  const baseWhere: Prisma.QuoteWhereInput =
    view === "archived"
      ? { archivedAt: { not: null } }
      : { archivedAt: null };

  const where: Prisma.QuoteWhereInput = list.q
    ? { AND: [baseWhere, searchWhere(list.q)] }
    : baseWhere;

  const [quotes, total, activeCount, archivedCount] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: orderByFor(list.sort, list.dir),
      include: {
        project: {
          include: {
            client: {
              include: {
                contacts: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
      skip: list.skip,
      take: list.take,
    }),
    prisma.quote.count({ where }),
    prisma.quote.count({ where: { archivedAt: null } }),
    prisma.quote.count({ where: { archivedAt: { not: null } } }),
  ]);

  const pathname = "/dashboard/quotes";
  const currentForUrl = {
    view: view === "active" ? undefined : "archived",
    q: list.q || undefined,
    sort: list.sort,
    dir: list.dir,
    page: String(list.page),
  };
  const sortHeaderHrefFor = (p: { sort: string; dir: SortDir; page: string }) =>
    buildListUrl(pathname, currentForUrl, p);
  const pageHrefFor = (p: { page: string }) =>
    buildListUrl(pathname, currentForUrl, { page: p.page });

  const activeTabHref = buildListUrl(
    pathname,
    { q: list.q || undefined, sort: list.sort, dir: list.dir },
    { view: null, page: null }
  );
  const archivedTabHref = buildListUrl(
    pathname,
    { q: list.q || undefined, sort: list.sort, dir: list.dir },
    { view: "archived", page: null }
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
        <Link
          href="/dashboard/quotes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          New Quote
        </Link>
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-4">
        <Link
          href={activeTabHref}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            view === "active"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Active ({activeCount})
        </Link>
        <Link
          href={archivedTabHref}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            view === "archived"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Archived ({archivedCount})
        </Link>
      </div>

      <SearchForm
        action={pathname}
        q={list.q}
        placeholder="Search quote #, project, client…"
        preserved={{
          view: view === "active" ? undefined : "archived",
          sort: list.sort,
          dir: list.dir,
        }}
      />

      {quotes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          {list.q ? (
            <p className="text-slate-500">No quotes match your search.</p>
          ) : view === "active" ? (
            <>
              <p className="text-slate-500 mb-4">No quotes yet.</p>
              <Link
                href="/dashboard/quotes/new"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Create your first quote →
              </Link>
            </>
          ) : (
            <p className="text-slate-500">No archived quotes.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <SortableHeader
                  label="Quote #"
                  columnKey="quoteNumber"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Project"
                  columnKey="project"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Client"
                  columnKey="client"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Fee"
                  columnKey="fee"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                  defaultDir="desc"
                />
                <SortableHeader
                  label="Status"
                  columnKey="status"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Date"
                  columnKey="date"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                  defaultDir="desc"
                />
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((quote) => {
                const client = quote.project.client;
                const clientLabel =
                  client.companyName ??
                  (client.contacts[0]
                    ? `${client.contacts[0].firstName} ${client.contacts[0].lastName}`
                    : "—");
                return (
                  <tr key={quote.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {quote.quoteNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-900">
                      {quote.project.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{clientLabel}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatMoney(quote.fee)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatDate(quote.date)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/quotes/${quote.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={list.page}
        perPage={list.perPage}
        total={total}
        hrefFor={pageHrefFor}
      />
    </>
  );
}
