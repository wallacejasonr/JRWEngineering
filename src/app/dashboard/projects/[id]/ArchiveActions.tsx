"use client";

import Link from "next/link";
import { useState } from "react";
import { archiveProject, unarchiveProject } from "../actions";

type BlockingInvoice = {
  id: string;
  invoiceNumber: string;
  status: string;
};

export default function ArchiveActions({
  projectId,
  archived,
  blockingInvoices,
  isAdmin,
}: {
  projectId: string;
  archived: boolean;
  blockingInvoices: BlockingInvoice[];
  isAdmin: boolean;
}) {
  const [showBlockers, setShowBlockers] = useState(false);

  // Archiving/unarchiving is an admin-only action.
  if (!isAdmin) {
    return null;
  }

  if (archived) {
    return (
      <form
        action={async () => {
          await unarchiveProject(projectId);
        }}
      >
        <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium">
          Unarchive
        </button>
      </form>
    );
  }

  if (blockingInvoices.length === 0) {
    return (
      <form
        action={async () => {
          await archiveProject(projectId);
        }}
      >
        <button className="text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-md font-medium">
          Archive
        </button>
      </form>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled
        onMouseEnter={() => setShowBlockers(true)}
        onMouseLeave={() => setShowBlockers(false)}
        onFocus={() => setShowBlockers(true)}
        onBlur={() => setShowBlockers(false)}
        onClick={() => setShowBlockers((v) => !v)}
        title="Cannot archive — project has unpaid invoices"
        className="text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-md font-medium opacity-60 cursor-not-allowed"
      >
        Archive
      </button>
      {showBlockers && (
        <div className="absolute right-0 top-full mt-2 w-80 z-10 bg-white rounded-md border border-slate-200 shadow-lg p-4 text-left">
          <p className="text-sm font-medium text-slate-900 mb-2">
            Resolve these invoices first:
          </p>
          <ul className="space-y-1">
            {blockingInvoices.map((inv) => (
              <li key={inv.id}>
                <Link
                  href={`/dashboard/invoices/${inv.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <span className="font-mono">{inv.invoiceNumber}</span> &mdash;{" "}
                  {inv.status}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-2">
            Mark them paid or cancelled to enable archive.
          </p>
        </div>
      )}
    </div>
  );
}
