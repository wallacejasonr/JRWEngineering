import Link from "next/link";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Placeholder data
  const client = {
    id,
    company: "Sandbox Projects",
    email: "info@sandboxprojects.com",
    phone: "(555) 100-2000",
    address: "123 Main St",
    city: "Denver",
    state: "CO",
    zip: "80202",
    notes: "Long-standing client, primarily residential and multi-family.",
  };

  const contacts = [
    {
      name: "Josh Sandbox",
      email: "josh@sandboxprojects.com",
      phone: "(555) 100-2001",
      title: "Owner",
      isPrimary: true,
    },
    {
      name: "Maria Sandbox",
      email: "maria@sandboxprojects.com",
      phone: "(555) 100-2002",
      title: "Project Manager",
      isPrimary: false,
    },
  ];

  const projects = [
    {
      id: "p1",
      number: "25-063",
      name: "Multi-Family Structural",
      status: "active",
    },
    {
      id: "p2",
      number: "25-060",
      name: "Townhome Foundation Review",
      status: "completed",
    },
    {
      id: "p3",
      number: "25-055",
      name: "Commercial Remodel Structural",
      status: "active",
    },
  ];

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/clients"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Clients
        </Link>
      </div>

      {/* Client Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {client.company}
        </h1>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <span className="font-medium text-slate-500">Email:</span>{" "}
            {client.email}
          </div>
          <div>
            <span className="font-medium text-slate-500">Phone:</span>{" "}
            {client.phone}
          </div>
          <div>
            <span className="font-medium text-slate-500">Address:</span>{" "}
            {client.address}, {client.city}, {client.state} {client.zip}
          </div>
        </div>
        {client.notes && (
          <p className="mt-3 text-sm text-slate-500">{client.notes}</p>
        )}
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {contacts.map((contact) => (
            <div key={contact.email} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">
                  {contact.name}
                  {contact.isPrimary && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                </p>
                <p className="text-sm text-slate-500">{contact.title}</p>
              </div>
              <div className="text-sm text-slate-600 text-right">
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
        </div>
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
                <td className="px-6 py-4 text-slate-900">{project.name}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    completed: "bg-slate-100 text-slate-600",
    on_hold: "bg-yellow-100 text-yellow-700",
    archived: "bg-slate-100 text-slate-500",
  };
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
