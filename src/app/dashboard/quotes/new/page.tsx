"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewQuotePage() {
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState("");
  const [inclusions, setInclusions] = useState<string[]>([""]);
  const [exclusions, setExclusions] = useState<string[]>([""]);
  const [fee, setFee] = useState("");
  const [billingTerms, setBillingTerms] = useState("");

  function addInclusion() {
    setInclusions((prev) => [...prev, ""]);
  }

  function removeInclusion(index: number) {
    setInclusions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateInclusion(index: number, value: string) {
    setInclusions((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addExclusion() {
    setExclusions((prev) => [...prev, ""]);
  }

  function removeExclusion(index: number) {
    setExclusions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateExclusion(index: number, value: string) {
    setExclusions((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/quotes"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Quotes
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Quote</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a project...</option>
                <option value="1">25-063 - Multi-Family Structural</option>
                <option value="2">25-060 - Townhome Foundation Review</option>
                <option value="3">
                  25-055 - Commercial Remodel Structural
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Inclusions
              </label>
              <button
                type="button"
                onClick={addInclusion}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {inclusions.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateInclusion(index, e.target.value)}
                    placeholder="Included service..."
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  {inclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclusion(index)}
                      className="text-red-400 hover:text-red-600 px-2 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Exclusions
              </label>
              <button
                type="button"
                onClick={addExclusion}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {exclusions.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateExclusion(index, e.target.value)}
                    placeholder="Excluded item..."
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  {exclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExclusion(index)}
                      className="text-red-400 hover:text-red-600 px-2 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fee
              </label>
              <input
                type="text"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="$0.00"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Billing Terms
            </label>
            <textarea
              rows={2}
              value={billingTerms}
              onChange={(e) => setBillingTerms(e.target.value)}
              placeholder="e.g. Project will be billed 100% at time of submission"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Create Quote
            </button>
            <Link
              href="/dashboard/quotes"
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
