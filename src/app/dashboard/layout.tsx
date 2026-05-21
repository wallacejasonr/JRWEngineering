import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Dashboard | JRW Engineering",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
