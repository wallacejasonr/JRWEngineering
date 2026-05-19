"use client";

import Link from "next/link";
import { useActionState } from "react";
import { emptyFormState, type FormState } from "@/lib/form-state";
import { updateInvoice } from "../../actions";

type Defaults = {
  invoiceId: string;
  invoiceDate: string;
  billingFrom: string;
  billingTo: string;
  dueDate: string;
  invoiceService: string;
  notes: string | null;
};

export default function EditInvoiceForm({ defaults }: { defaults: Defaults }) {
  const action = updateInvoice.bind(null, defaults.invoiceId);
  const [state, formAction, pending] = useActionState(action, emptyFormState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.ok && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Invoice Date" name="invoiceDate" state={state}>
          <input
            name="invoiceDate"
            type="date"
            required
            defaultValue={defaults.invoiceDate}
            className={inputClass}
          />
        </Field>
        <Field label="Due Date" name="dueDate" optional state={state}>
          <input
            name="dueDate"
            type="date"
            defaultValue={defaults.dueDate}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Service" name="invoiceService" state={state}>
        <input
          name="invoiceService"
          type="text"
          required
          defaultValue={defaults.invoiceService}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Billing From" name="billingFrom" optional state={state}>
          <input
            name="billingFrom"
            type="date"
            defaultValue={defaults.billingFrom}
            className={inputClass}
          />
        </Field>
        <Field label="Billing To" name="billingTo" optional state={state}>
          <input
            name="billingTo"
            type="date"
            defaultValue={defaults.billingTo}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Notes" name="notes" optional state={state}>
        <textarea
          name="notes"
          rows={4}
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
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <Link
          href={`/dashboard/invoices/${defaults.invoiceId}`}
          className="text-sm text-slate-600 hover:text-slate-800"
        >
          Cancel
        </Link>
      </div>
    </form>
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
