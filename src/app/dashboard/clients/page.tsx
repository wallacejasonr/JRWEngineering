import Link from "next/link";

export default function ClientsPage() {
  const clients = [
    {
      id: "1",
      company: "Sandbox Projects",
      contact: "Josh Sandbox",
      email: "josh@sandboxprojects.com",
      phone: "(555) 100-2000",
      projects: 3,
    },
    {
      id: "2",
      company: "Origin Design and Tech",
      contact: "Sarah Origin",
      email: "sarah@origindesign.com",
      phone: "(555) 200-3000",
      projects: 2,
    },
    {
      id: "3",
      company: null,
      contact: "David Bostic",
      email: "david.bostic@email.com",
      phone: "(555) 300-4000",
      projects: 1,
    },
  ];

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

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Company Name
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Primary Contact
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Email
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Phone
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Projects
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {client.company ?? (
                    <span className="text-slate-400 italic">Individual</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-700">{client.contact}</td>
                <td className="px-6 py-4 text-slate-700">{client.email}</td>
                <td className="px-6 py-4 text-slate-700">{client.phone}</td>
                <td className="px-6 py-4 text-slate-700">{client.projects}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
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
