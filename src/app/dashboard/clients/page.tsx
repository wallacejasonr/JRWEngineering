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
import { unarchiveClient } from "./actions";

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const SORT_KEYS = [
  "companyName",
  "email",
  "phone",
  "projects",
  "createdAt",
] as const;
type SortKey = (typeof SORT_KEYS)[number];

function orderByFor(
  sort: SortKey,
  dir: SortDir
): Prisma.ClientOrderByWithRelationInput[] {
  switch (sort) {
    case "companyName":
      return [{ companyName: { sort: dir, nulls: "last" } }];
    case "email":
      return [{ email: { sort: dir, nulls: "last" } }];
    case "phone":
      return [{ phone: { sort: dir, nulls: "last" } }];
    case "projects":
      return [{ projects: { _count: dir } }];
    case "createdAt":
    default:
      return [{ createdAt: dir }];
  }
}

function searchWhere(q: string): Prisma.ClientWhereInput {
  return {
    OR: [
      { companyName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      {
        contacts: {
          some: {
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          },
        },
      },
    ],
  };
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const raw = await searchParams;
  const viewRaw = typeof raw.view === "string" ? raw.view : undefined;
  const view = viewRaw === "archived" ? "archived" : "active";

  const list = parseListParams<SortKey>(raw, {
    sortKeys: SORT_KEYS,
    defaultSort: "createdAt",
    defaultDir: "desc",
  });

  const baseWhere: Prisma.ClientWhereInput =
    view === "archived"
      ? { archivedAt: { not: null } }
      : { archivedAt: null };

  const where: Prisma.ClientWhereInput = list.q
    ? { AND: [baseWhere, searchWhere(list.q)] }
    : baseWhere;

  const [clients, total, activeCount, archivedCount] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: orderByFor(list.sort, list.dir),
      include: {
        contacts: { where: { isPrimary: true }, take: 1 },
        _count: { select: { projects: true } },
      },
      skip: list.skip,
      take: list.take,
    }),
    prisma.client.count({ where }),
    prisma.client.count({ where: { archivedAt: null } }),
    prisma.client.count({ where: { archivedAt: { not: null } } }),
  ]);

  const pathname = "/dashboard/clients";

  const currentForUrl = {
    view: view === "active" ? undefined : "archived",
    q: list.q || undefined,
    sort: list.sort,
    dir: list.dir,
    page: String(list.page),
  };

  const sortHeaderHrefFor = (p: { sort: string; dir: SortDir; page: string }) =>
    buildListUrl(pathname, currentForUrl, {
      sort: p.sort,
      dir: p.dir,
      page: p.page,
    });

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
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <Link
          href="/dashboard/clients/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          New Client
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
        placeholder="Search company, contact, email…"
        preserved={{
          view: view === "active" ? undefined : "archived",
          sort: list.sort,
          dir: list.dir,
        }}
      />

      {clients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          {list.q ? (
            <p className="text-slate-500">No clients match your search.</p>
          ) : view === "active" ? (
            <>
              <p className="text-slate-500 mb-4">No clients yet.</p>
              <Link
                href="/dashboard/clients/new"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Create your first client →
              </Link>
            </>
          ) : (
            <p className="text-slate-500">No archived clients.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <SortableHeader
                  label="Company Name"
                  columnKey="companyName"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Primary Contact
                </th>
                <SortableHeader
                  label="Email"
                  columnKey="email"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Phone"
                  columnKey="phone"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Projects"
                  columnKey="projects"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                  defaultDir="desc"
                />
                <SortableHeader
                  label="Added"
                  columnKey="createdAt"
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
              {clients.map((client) => {
                const primary = client.contacts[0];
                return (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>
                          {client.companyName ?? (
                            <span className="text-slate-400 italic">
                              Individual
                            </span>
                          )}
                        </span>
                        {view === "archived" && (
                          <StatusBadge status="archived" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {primary
                        ? `${primary.firstName} ${primary.lastName}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {primary?.email ?? client.email ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {primary?.phone ?? client.phone ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {client._count.projects}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/clients/${client.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                        {view === "archived" && (
                          <form
                            action={async () => {
                              "use server";
                              await unarchiveClient(client.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="text-slate-600 hover:text-slate-900 font-medium"
                            >
                              Unarchive
                            </button>
                          </form>
                        )}
                      </div>
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
