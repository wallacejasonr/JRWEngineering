"use client";

import Link from "next/link";
import { useState } from "react";
import { archiveClient, unarchiveClient } from "../actions";

type BlockingProject = {
  id: string;
  projectNumber: string;
  name: string;
};

export default function ArchiveActions({
  clientId,
  archived,
  blockingProjects,
}: {
  clientId: string;
  archived: boolean;
  blockingProjects: BlockingProject[];
}) {
  const [showBlockers, setShowBlockers] = useState(false);

  if (archived) {
    return (
      <form
        action={async () => {
          await unarchiveClient(clientId);
        }}
      >
        <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium">
          Unarchive
        </button>
      </form>
    );
  }

  if (blockingProjects.length === 0) {
    return (
      <form
        action={async () => {
          await archiveClient(clientId);
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
        title="Cannot archive — client has non-archived projects"
        className="text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-md font-medium opacity-60 cursor-not-allowed"
      >
        Archive
      </button>
      {showBlockers && (
        <div className="absolute right-0 top-full mt-2 w-80 z-10 bg-white rounded-md border border-slate-200 shadow-lg p-4 text-left">
          <p className="text-sm font-medium text-slate-900 mb-2">
            Archive the following projects first:
          </p>
          <ul className="space-y-1">
            {blockingProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/dashboard/projects/${p.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <span className="font-mono">{p.projectNumber}</span> &mdash;{" "}
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
