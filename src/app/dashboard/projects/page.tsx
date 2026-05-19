import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ projectNumber: "desc" }],
    include: {
      client: {
        include: {
          contacts: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

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

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">No projects yet.</p>
          <Link
            href="/dashboard/projects/new"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Create your first project →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Project #</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Client</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Service</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
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
                    <td className="px-6 py-4 text-slate-700">{project.service}</td>
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
    </>
  );
}
