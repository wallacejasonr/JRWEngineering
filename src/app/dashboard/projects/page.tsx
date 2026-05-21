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

const SORT_KEYS = [
  "projectNumber",
  "name",
  "client",
  "service",
  "status",
  "createdAt",
] as const;
type SortKey = (typeof SORT_KEYS)[number];

function orderByFor(
  sort: SortKey,
  dir: SortDir
): Prisma.ProjectOrderByWithRelationInput[] {
  switch (sort) {
    case "projectNumber":
      return [{ projectNumber: dir }];
    case "name":
      return [{ name: dir }];
    case "client":
      return [{ client: { companyName: { sort: dir, nulls: "last" } } }];
    case "service":
      return [{ service: dir }];
    case "status":
      return [{ status: dir }];
    case "createdAt":
    default:
      return [{ createdAt: dir }];
  }
}

function searchWhere(q: string): Prisma.ProjectWhereInput {
  return {
    OR: [
      { projectNumber: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { service: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
      { client: { companyName: { contains: q, mode: "insensitive" } } },
      {
        client: {
          contacts: {
            some: { lastName: { contains: q, mode: "insensitive" } },
          },
        },
      },
    ],
  };
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<ListSearchParams>;
}) {
  const raw = await searchParams;
  const list = parseListParams<SortKey>(raw, {
    sortKeys: SORT_KEYS,
    defaultSort: "projectNumber",
    defaultDir: "desc",
  });

  const where: Prisma.ProjectWhereInput = list.q ? searchWhere(list.q) : {};

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: orderByFor(list.sort, list.dir),
      include: {
        client: {
          include: {
            contacts: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      skip: list.skip,
      take: list.take,
    }),
    prisma.project.count({ where }),
  ]);

  const pathname = "/dashboard/projects";
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
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          New Project
        </Link>
      </div>

      <SearchForm
        action={pathname}
        q={list.q}
        placeholder="Search project #, name, client, service…"
        preserved={{ sort: list.sort, dir: list.dir }}
      />

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          {list.q ? (
            <p className="text-slate-500">No projects match your search.</p>
          ) : (
            <>
              <p className="text-slate-500 mb-4">No projects yet.</p>
              <Link
                href="/dashboard/projects/new"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Create your first project →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <SortableHeader
                  label="Project #"
                  columnKey="projectNumber"
                  currentSort={list.sort}
                  currentDir={list.dir}
                  hrefFor={sortHeaderHrefFor}
                  defaultDir="desc"
                />
                <SortableHeader
                  label="Name"
                  columnKey="name"
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
                  label="Service"
                  columnKey="service"
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
                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => {
                const clientLabel =
                  project.client.companyName ??
                  (project.client.contacts[0]
                    ? `${project.client.contacts[0].firstName} ${project.client.contacts[0].lastName}`
                    : "—");
                return (
                  <tr key={project.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {project.projectNumber}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{clientLabel}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {project.service}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
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
