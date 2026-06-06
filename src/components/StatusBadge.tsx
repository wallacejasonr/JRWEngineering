const STYLES: Record<string, string> = {
  // Project
  active: "bg-green-100 text-green-700",
  completed: "bg-slate-100 text-slate-600",
  on_hold: "bg-yellow-100 text-yellow-700",
  archived: "bg-slate-100 text-slate-500",
  // Quote
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  // Invoice
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
  partial: "bg-amber-100 text-amber-700",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${style}`}>
      {status.replace("_", " ")}
    </span>
  );
}
