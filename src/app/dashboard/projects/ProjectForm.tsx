"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { emptyFormState, type FormState } from "@/lib/form-state";

type ClientOption = {
  id: string;
  companyName: string | null;
  contacts: { id: string; firstName: string; lastName: string; isPrimary: boolean }[];
};

type Defaults = {
  projectNumber: string;
  name: string;
  clientId: string;
  primaryContactId: string | null;
  service: string;
  description: string | null;
  location: string;
  status: "active" | "completed" | "on_hold" | "archived";
};

export default function ProjectForm({
  action,
  defaults,
  clients,
  cancelHref,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults: Defaults;
  clients: ClientOption[];
  cancelHref: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, emptyFormState);
  const [clientId, setClientId] = useState(defaults.clientId);
  const [primaryContactId, setPrimaryContactId] = useState(
    defaults.primaryContactId ?? ""
  );

  const selectedClient = clients.find((c) => c.id === clientId);
  const contactOptions = selectedClient?.contacts ?? [];

  function clientLabel(c: ClientOption): string {
    if (c.companyName) return c.companyName;
    const primary = c.contacts.find((x) => x.isPrimary) ?? c.contacts[0];
    return primary ? `${primary.firstName} ${primary.lastName}` : "(unnamed)";
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.ok && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Project Number" name="projectNumber" state={state}>
          <input
            name="projectNumber"
            type="text"
            required
            defaultValue={defaults.projectNumber}
            placeholder="YY-NNN"
            className={`${inputClass} font-mono`}
          />
        </Field>
        <Field label="Status" name="status" state={state}>
          <select
            name="status"
            defaultValue={defaults.status}
            className={inputClass}
          >
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
      </div>

      <Field label="Name" name="name" state={state}>
        <input
          name="name"
          type="text"
          required
          defaultValue={defaults.name}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Client" name="clientId" state={state}>
          <select
            name="clientId"
            required
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setPrimaryContactId("");
            }}
            className={inputClass}
          >
            <option value="">Select a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {clientLabel(c)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Primary Contact" name="primaryContactId" optional state={state}>
          <select
            name="primaryContactId"
            value={primaryContactId}
            onChange={(e) => setPrimaryContactId(e.target.value)}
            disabled={!selectedClient}
            className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
          >
            <option value="">
              {selectedClient
                ? "Default to client primary"
                : "Select a client first"}
            </option>
            {contactOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
                {c.isPrimary ? " (primary)" : ""}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Service" name="service" state={state}>
        <input
          name="service"
          type="text"
          required
          defaultValue={defaults.service}
          placeholder="e.g. Structural Engineering"
          className={inputClass}
        />
      </Field>

      <Field label="Location" name="location" state={state}>
        <input
          name="location"
          type="text"
          required
          defaultValue={defaults.location}
          placeholder="Full address"
          className={inputClass}
        />
      </Field>

      <Field label="Description" name="description" optional state={state}>
        <textarea
          name="description"
          rows={4}
          defaultValue={defaults.description ?? ""}
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
