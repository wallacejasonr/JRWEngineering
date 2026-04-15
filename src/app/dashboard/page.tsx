export default function DashboardPage() {
  const stats = [
    { label: "Active Projects", value: 5, color: "bg-blue-50 text-blue-700" },
    { label: "Active Clients", value: 4, color: "bg-green-50 text-green-700" },
    {
      label: "Pending Quotes",
      value: 3,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Outstanding Invoices",
      value: 2,
      color: "bg-red-50 text-red-700",
    },
  ];

  const recentActivity = [
    {
      text: 'Quote Q-25-001 sent for "Sandbox Multi-Family Structural"',
      time: "2 hours ago",
    },
    {
      text: 'New project 25-063 created: "Sandbox - Multi-Family Structural"',
      time: "3 hours ago",
    },
    {
      text: "Invoice JRWE-25-001 marked as paid",
      time: "1 day ago",
    },
    {
      text: 'Client "Origin Design and Tech" added',
      time: "2 days ago",
    },
    {
      text: 'Project 25-060 status changed to "Completed"',
      time: "3 days ago",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6 border border-slate-200"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {recentActivity.map((item, i) => (
            <li key={i} className="px-6 py-4 flex justify-between items-start">
              <span className="text-sm text-slate-700">{item.text}</span>
              <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
