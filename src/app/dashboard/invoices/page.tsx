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
  "invoiceNumber",
  "project",
  "client",
  "total",
  "status",
  "invoiceDate",
] as const;
type SortKey = (typeof SORT_KEYS)[number];

function orderByFor(
  sort: SortKey,
  dir: SortDir
): Prisma.InvoiceOrderByWithRelationInput[] {
  switch (sort) {
    case "invoiceNumber":
      return [{ invoiceNumber: dir }];
    case "project":
      return [{ project: { name: dir } }];
    case "client":
      return [{ project: { client: { companyName: { sort: dir, nulls: "last" } } } }];
    case "total":
      return [{ total: dir }];
    case "status":
      return [{ status: dir }];
    case "invoiceDate":
    default:
      return [{ invoiceDate: dir }];
  }
}

function searchWhere(q: string): Prisma.InvoiceWhereInput {
  return {
    OR: [
      { invoiceNumber: { contains: q, mode: "insensitive" } },
      { project: { name: { contains: q, mode: "insensitive" } } },
      {
        project: {
          client: { companyName: { contains: q, mode: "insensitive" } },
        },
      },
    ],
  };
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const raw = await searchParams;
  const viewRaw = typeof raw.view === "string" ? raw.view : undefined;
  const view = viewRaw === "archived" ? "archived" : "active";

  const list = parseListParams<SortKey>(raw, {
    sortKeys: SORT_KEYS,
    defaultSort: "invoiceDate",
    defaultDir: "desc",
  });

  const baseWhere: Prisma.InvoiceWhereInput =
    view === "archived"
      ? { archivedAt: { not: null } }
      : { archivedAt: null };

  const where: Prisma.InvoiceWhereInput = list.q
    ? { AND: [baseWhere, searchWhere(list.q)] }
    : baseWhere;

  const [invoices, total, activeCount, archivedCount] = await Promise.all([
    prisma.invoice.findMany({
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
    prisma.invoice.count({ where }),
    prisma.invoice.count({ where: { archivedAt: null } }),
    prisma.invoice.count({ where: { archivedAt: { not: null } } }),
  ]);

  const pathname = "/dashboard/invoices";
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
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
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
        placeholder="Search invoice #, project, client…"
        preserved={{
          view: view === "active" ? undefined : "archived",
          sort: list.sort,
          dir: list.dir,
        }}
      />

      {invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          {list.q ? (
            <p className="text-slate-500">No invoices match your search.</p>
          ) : view === "active" ? (
            <>
              <p className="text-slate-500 mb-4">No invoices yet.</p>
              <p className="text-sm text-slate-400">
                Invoices are created by converting approved quotes.
              </p>
              <Link
                href="/dashboard/quotes"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Go to Quotes →
              </Link>
            </>
          ) : (
            <p className="text-slate-500">No archived invoices.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <SortableHeader
                  label="Invoice #"
                  columnKey="invoiceNumber"
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
                  label="Total"
                  columnKey="total"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                  defaultDir="desc"
                  align="right"
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
                  columnKey="invoiceDate"
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
              {invoices.map((invoice) => {
                const client = invoice.project.client;
                const clientLabel =
                  client.companyName ??
                  (client.contacts[0]
                    ? `${client.contacts[0].firstName} ${client.contacts[0].lastName}`
                    : "—");
                return (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-900">
                      {invoice.project.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{clientLabel}</td>
                    <td className="px-6 py-4 text-right text-slate-700 font-medium">
                      {formatMoney(invoice.total)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatDate(invoice.invoiceDate)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
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
