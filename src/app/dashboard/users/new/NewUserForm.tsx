"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createUser, type UserActionResult } from "../actions";
import TempPasswordPanel from "../TempPasswordPanel";

const initial: UserActionResult = { ok: false };

export default function NewUserForm() {
  const [state, formAction, pending] = useActionState(createUser, initial);

  if (state.ok && state.tempPassword) {
    return (
      <TempPasswordPanel
        password={state.tempPassword}
        title="User created"
        description={`${state.message} Save this temporary password — it will not be shown again.`}
      />
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.ok && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {state.message}
        </div>
      )}

      <Field label="Name" name="name" state={state}>
        <input
          name="name"
          type="text"
          required
          className={inputClass}
        />
      </Field>

      <Field label="Email" name="email" state={state}>
        <input
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="staff@jrwengineering.com"
        />
      </Field>

      <Field label="Role" name="role" state={state}>
        <select name="role" defaultValue="user" className={inputClass}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </Field>

      <p className="text-xs text-slate-500">
        A temporary password will be generated and shown once after creation.
        Share it with the user out-of-band.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          {pending ? "Creating…" : "Create User"}
        </button>
        <Link
          href="/dashboard/users"
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
  state,
  children,
}: {
  label: string;
  name: string;
  state: { fieldErrors?: Record<string, string[]> };
  children: React.ReactNode;
}) {
  const errors = state.fieldErrors?.[name];
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
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
