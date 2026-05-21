"use client";

import Link from "next/link";
import { useState } from "react";

export default function TempPasswordPanel({
  password,
  title = "Temporary password generated",
  description = "Save this password — it will not be shown again. Share it with the user out-of-band.",
  showListLink = true,
}: {
  password: string;
  title?: string;
  description?: string;
  showListLink?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the text for manual copy
    }
  }

  return (
    <div className="rounded-md border border-green-200 bg-green-50 p-5">
      <h3 className="text-sm font-semibold text-green-900">{title}</h3>
      <p className="mt-1 text-sm text-green-800">{description}</p>

      <div className="mt-4 flex items-center gap-3">
        <code
          className="flex-1 select-all rounded border border-green-300 bg-white px-3 py-2 font-mono text-sm text-slate-900"
          onClick={(e) => {
            const range = document.createRange();
            range.selectNodeContents(e.currentTarget);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }}
        >
          {password}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-3 py-2"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {showListLink && (
        <div className="mt-4">
          <Link
            href="/dashboard/users"
            className="text-sm font-medium text-green-700 hover:text-green-900"
          >
            I have saved this — go to user list →
          </Link>
        </div>
      )}
    </div>
  );
}
