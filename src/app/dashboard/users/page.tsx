import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { SortableHeader } from "@/components/list/SortableHeader";
import { SearchForm } from "@/components/list/SearchForm";
import { Pagination } from "@/components/list/Pagination";
import {
  buildListUrl,
  parseListParams,
  type ListSearchParams,
  type SortDir,
} from "@/lib/list-params";

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const SORT_KEYS = [
  "name",
  "email",
  "role",
  "status",
  "createdAt",
] as const;
type SortKey = (typeof SORT_KEYS)[number];

function orderByFor(
  sort: SortKey,
  dir: SortDir
): Prisma.UserOrderByWithRelationInput[] {
  switch (sort) {
    case "name":
      return [{ name: { sort: dir, nulls: "last" } }];
    case "email":
      return [{ email: dir }];
    case "role":
      return [{ role: dir }];
    case "status":
      return [{ deactivatedAt: { sort: dir, nulls: "first" } }];
    case "createdAt":
    default:
      return [{ createdAt: dir }];
  }
}

function searchWhere(q: string): Prisma.UserWhereInput {
  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ],
  };
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  await requireAdmin();

  const raw = await searchParams;
  const list = parseListParams<SortKey>(raw, {
    sortKeys: SORT_KEYS,
    defaultSort: "createdAt",
    defaultDir: "asc",
  });

  const where: Prisma.UserWhereInput = list.q ? searchWhere(list.q) : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: orderByFor(list.sort, list.dir),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        deactivatedAt: true,
        createdAt: true,
      },
      skip: list.skip,
      take: list.take,
    }),
    prisma.user.count({ where }),
  ]);

  const pathname = "/dashboard/users";
  const currentForUrl = {
    q: list.q || undefined,
    sort: list.sort,
    dir: list.dir,
    page: String(list.page),
  };
  const sortHeaderHrefFor = (p: { sort: string; dir: SortDir; page: string }) =>
    buildListUrl(pathname, currentForUrl, p);
  const pageHrefFor = (p: { page: string }) =>
    buildListUrl(pathname, currentForUrl, { page: p.page });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <Link
          href="/dashboard/users/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          New User
        </Link>
      </div>

      <SearchForm
        action={pathname}
        q={list.q}
        placeholder="Search name or email…"
        preserved={{ sort: list.sort, dir: list.dir }}
      />

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500">
            {list.q ? "No users match your search." : "No users yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <SortableHeader
                  label="Name"
                  columnKey="name"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Email"
                  columnKey="email"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Role"
                  columnKey="role"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Status"
                  columnKey="status"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                />
                <SortableHeader
                  label="Created"
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {user.name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4">
                    {user.deactivatedAt ? (
                      <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        Deactivated
                      </span>
                    ) : (
                      <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
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

function RoleBadge({ role }: { role: "admin" | "user" }) {
  const styles =
    role === "admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${styles}`}
    >
      {role}
    </span>
  );
}
