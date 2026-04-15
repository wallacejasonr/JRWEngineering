import Link from "next/link";

export default function ProjectsPage() {
  const projects = [
    {
      id: "1",
      number: "25-063",
      name: "Multi-Family Structural",
      client: "Sandbox Projects",
      service: "Mechanical Support Design",
      status: "active",
    },
    {
      id: "2",
      number: "25-060",
      name: "Townhome Foundation Review",
      client: "Sandbox Projects",
      service: "Structural Engineering",
      status: "completed",
    },
    {
      id: "3",
      number: "25-055",
      name: "Commercial Remodel Structural",
      client: "Origin Design and Tech",
      service: "Structural Engineering",
      status: "active",
    },
    {
      id: "4",
      number: "25-050",
      name: "Residential Addition",
      client: "David Bostic",
      service: "Structural Engineering",
      status: "on_hold",
    },
    {
      id: "5",
      number: "24-112",
      name: "Office Tenant Improvement",
      client: "Origin Design and Tech",
      service: "MEP Coordination",
      status: "archived",
    },
  ];

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    completed: "bg-slate-100 text-slate-600",
    on_hold: "bg-yellow-100 text-yellow-700",
    archived: "bg-slate-100 text-slate-500",
  };

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

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Project #
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Name
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Client
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Service
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Status
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-700">
                  {project.number}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {project.name}
                </td>
                <td className="px-6 py-4 text-slate-700">{project.client}</td>
                <td className="px-6 py-4 text-slate-700">{project.service}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyles[project.status] ?? ""}`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
