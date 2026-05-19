"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateClient } from "../../actions";
import { emptyFormState } from "@/lib/form-state";

type Client = {
  id: string;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  notes: string | null;
};

export default function EditClientForm({ client }: { client: Client }) {
  const action = updateClient.bind(null, client.id);
  const [state, formAction, pending] = useActionState(action, emptyFormState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.ok && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {state.message}
        </div>
      )}

      <Field label="Company Name" name="companyName" optional state={state}>
        <input
          name="companyName"
          type="text"
          defaultValue={client.companyName ?? ""}
          className={inputClass}
          placeholder="Leave blank for individual clients"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email" name="email" optional state={state}>
          <input
            name="email"
            type="email"
            defaultValue={client.email ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Phone" name="phone" optional state={state}>
          <input
            name="phone"
            type="tel"
            defaultValue={client.phone ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Address" name="address" optional state={state}>
        <input
          name="address"
          type="text"
          defaultValue={client.address ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2">
          <Field label="City" name="city" optional state={state}>
            <input
              name="city"
              type="text"
              defaultValue={client.city ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="State" name="state" optional state={state}>
          <input
            name="state"
            type="text"
            defaultValue={client.state ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Zip" name="zip" optional state={state}>
          <input
            name="zip"
            type="text"
            defaultValue={client.zip ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Notes" name="notes" optional state={state}>
        <textarea
          name="notes"
          rows={3}
          defaultValue={client.notes ?? ""}
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
          href={`/dashboard/clients/${client.id}`}
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
  state: { fieldErrors?: Record<string, string[]> };
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
