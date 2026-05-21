"use client";

import { useActionState, useRef } from "react";
import { changeOwnPassword } from "./actions";
import { emptyFormState, type FormState } from "@/lib/form-state";

export default function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    changeOwnPassword,
    emptyFormState
  );

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.message && (
        <div
          className={`text-sm rounded-md px-3 py-2 ${
            state.ok
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <Field label="Current Password" name="currentPassword" state={state}>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      <Field label="New Password" name="newPassword" state={state}>
        <input
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          minLength={10}
          className={inputClass}
        />
      </Field>

      <Field label="Confirm New Password" name="confirmPassword" state={state}>
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          minLength={10}
          className={inputClass}
        />
      </Field>

      <p className="text-xs text-slate-500">
        Password must be at least 10 characters.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
      >
        {pending ? "Updating…" : "Change Password"}
      </button>
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
  state: FormState;
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
