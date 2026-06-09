"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { emptyFormState, type FormState } from "@/lib/form-state";

type ProjectOption = {
  id: string;
  projectNumber: string;
  name: string;
};

type Defaults = {
  quoteNumber: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  inclusions: string[];
  exclusions: string[];
  fee: string;
  siteVisitRate: string;
  additionalHourlyRate: string;
  reportRate: string;
  billingTerms: string;
  notes: string | null;
  includeTypicalSsiMatrix: boolean;
  includeConcreteSsiMatrix: boolean;
};

export default function QuoteForm({
  action,
  defaults,
  projects,
  cancelHref,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults: Defaults;
  projects: ProjectOption[];
  cancelHref: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, emptyFormState);
  const [inclusions, setInclusions] = useState<string[]>(
    defaults.inclusions.length > 0 ? defaults.inclusions : [""]
  );
  const [exclusions, setExclusions] = useState<string[]>(
    defaults.exclusions.length > 0 ? defaults.exclusions : [""]
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.ok && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Quote Number" name="quoteNumber" state={state}>
          <input
            name="quoteNumber"
            type="text"
            required
            defaultValue={defaults.quoteNumber}
            className={`${inputClass} font-mono`}
          />
        </Field>
        <Field label="Date" name="date" state={state}>
          <input
            name="date"
            type="date"
            required
            defaultValue={defaults.date}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Project" name="projectId" state={state}>
        <select
          name="projectId"
          required
          defaultValue={defaults.projectId}
          className={inputClass}
        >
          <option value="">Select a project…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.projectNumber} — {p.name}
            </option>
          ))}
        </select>
      </Field>

      <ListField
        label="Inclusions"
        name="inclusions"
        items={inclusions}
        setItems={setInclusions}
        placeholder="Included service…"
        state={state}
      />

      <ListField
        label="Exclusions"
        name="exclusions"
        items={exclusions}
        setItems={setExclusions}
        placeholder="Excluded item…"
        state={state}
      />

      <Field label="Fee" name="fee" state={state}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
            $
          </span>
          <input
            name="fee"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaults.fee}
            className={`${inputClass} pl-7`}
            placeholder="0.00"
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Site Visit Rate" name="siteVisitRate" state={state}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              $
            </span>
            <input
              name="siteVisitRate"
              type="number"
              step="1"
              min="0"
              required
              defaultValue={defaults.siteVisitRate}
              className={`${inputClass} pl-7`}
              placeholder="0"
            />
          </div>
        </Field>
        <Field
          label="Additional Hourly Rate"
          name="additionalHourlyRate"
          state={state}
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              $
            </span>
            <input
              name="additionalHourlyRate"
              type="number"
              step="1"
              min="0"
              required
              defaultValue={defaults.additionalHourlyRate}
              className={`${inputClass} pl-7`}
              placeholder="0"
            />
          </div>
        </Field>
        <Field label="Report Rate" name="reportRate" state={state}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              $
            </span>
            <input
              name="reportRate"
              type="number"
              step="1"
              min="0"
              required
              defaultValue={defaults.reportRate}
              className={`${inputClass} pl-7`}
              placeholder="0"
            />
          </div>
        </Field>
      </div>

      <div className="space-y-2 pt-1">
        <p className="text-sm font-medium text-slate-700">Include in PDF addendum:</p>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="includeTypicalSsiMatrix"
            defaultChecked={defaults.includeTypicalSsiMatrix}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Typical SSI Pricing Matrix</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="includeConcreteSsiMatrix"
            defaultChecked={defaults.includeConcreteSsiMatrix}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Concrete Construction SSI Matrix</span>
        </label>
      </div>

      <Field label="Billing Terms" name="billingTerms" state={state}>
        <textarea
          name="billingTerms"
          rows={2}
          required
          defaultValue={defaults.billingTerms}
          placeholder="e.g. Project will be billed 100% at time of submission"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Field label="Notes" name="notes" optional state={state}>
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaults.notes ?? ""}
          className={`${inputClass} resize-none`}
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href={cancelHref} className="text-sm text-slate-600 hover:text-slate-800">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function ListField({
  label,
  name,
  items,
  setItems,
  placeholder,
  state,
}: {
  label: string;
  name: string;
  items: string[];
  setItems: (next: string[]) => void;
  placeholder: string;
  state: FormState;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <button
          type="button"
          onClick={() => setItems([...items, ""])}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Item
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              name={name}
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[index] = e.target.value;
                setItems(next);
              }}
              placeholder={placeholder}
              className={`flex-1 ${inputClass}`}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
                className="text-red-400 hover:text-red-600 px-2 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      {state.fieldErrors?.[name]?.map((err) => (
        <p key={err} className="text-xs text-red-600 mt-1">
          {err}
        </p>
      ))}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

function Field({
  label,
  name,
  optional,
  state,
  children,
}: {
  label: string;
  name: string;
  optional?: boolean;
  state: FormState;
  children: React.ReactNode;
}) {
  const errors = state.fieldErrors?.[name];
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}{" "}
        {optional && <span className="text-slate-400 font-normal">(optional)</span>}
      </label>
      {children}
      {errors?.map((err) => (
        <p key={err} className="text-xs text-red-600 mt-1">
          {err}
        </p>
      ))}
    </div>
  );
}
