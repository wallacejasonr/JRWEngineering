"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateUser } from "../../actions";
import { emptyFormState, type FormState } from "@/lib/form-state";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  role: "admin" | "user";
  deactivatedAt: Date | string | null;
};

export default function EditUserForm({
  user,
  isSelf,
  isLastActiveAdmin,
}: {
  user: UserData;
  isSelf: boolean;
  isLastActiveAdmin: boolean;
}) {
  const action = updateUser.bind(null, user.id);
  const [state, formAction, pending] = useActionState(action, emptyFormState);

  const lockRoleDemote = isSelf || isLastActiveAdmin;

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.ok && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {state.message}
        </div>
      )}

      <Field label="Email" name="email" state={state}>
        <input
          type="email"
          value={user.email}
          disabled
          className={`${inputClass} bg-slate-50 text-slate-500`}
        />
      </Field>

      <Field label="Name" name="name" state={state}>
        <input
          name="name"
          type="text"
          required
          defaultValue={user.name ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Role" name="role" state={state}>
        <select name="role" defaultValue={user.role} className={inputClass}>
          <option value="user" disabled={lockRoleDemote && user.role === "admin"}>
            User
          </option>
          <option value="admin">Admin</option>
        </select>
        {lockRoleDemote && user.role === "admin" && (
          <p className="text-xs text-slate-500 mt-1">
            {isSelf
              ? "You cannot change your own role."
              : "This is the last active admin and cannot be demoted."}
          </p>
        )}
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
