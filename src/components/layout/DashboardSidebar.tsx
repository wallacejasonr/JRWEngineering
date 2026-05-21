"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const baseNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: "~" },
  { label: "Clients", href: "/dashboard/clients", icon: "#" },
  { label: "Projects", href: "/dashboard/projects", icon: "P" },
  { label: "Quotes", href: "/dashboard/quotes", icon: "Q" },
  { label: "Invoices", href: "/dashboard/invoices", icon: "$" },
];

export default function DashboardSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    ...baseNavItems,
    ...(isAdmin
      ? [{ label: "Users", href: "/dashboard/users", icon: "U" }]
      : []),
    { label: "Account", href: "/dashboard/account", icon: "@" },
  ];

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold text-white">JRW Engineering</h1>
        <p className="text-xs text-slate-400 mt-0.5">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
            }`}
          >
            <span className="w-5 text-center text-xs font-mono">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User / Sign Out */}
      <div className="px-4 py-4 border-t border-slate-700">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
        >
          <span className="w-5 text-center text-xs font-mono">&larr;</span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-slate-800 text-white p-2 rounded-md shadow-md"
        aria-label="Open sidebar"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-64 h-full bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-shrink-0 bg-slate-900 h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
