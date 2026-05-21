"use client";

import { useActionState, useState } from "react";
import { resetUserPassword, type UserActionResult } from "../../actions";
import TempPasswordPanel from "../../TempPasswordPanel";

const initial: UserActionResult = { ok: false };

export default function ResetPasswordButton({ userId }: { userId: string }) {
  const action = resetUserPassword.bind(null, userId);
  const [state, formAction, pending] = useActionState(action, initial);
  const [confirming, setConfirming] = useState(false);

  if (state.ok && state.tempPassword) {
    return (
      <TempPasswordPanel
        password={state.tempPassword}
        title="Password reset"
        description="The user's password has been reset. Share this temporary password with them — it will not be shown again."
        showListLink={false}
      />
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium"
      >
        Reset Password
      </button>
    );
  }

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-900 mb-3">
        This will replace the user&apos;s current password with a new temporary
        one. The new password will be shown to you once.
      </p>
      <form action={formAction} className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-medium px-3 py-1.5 rounded-md"
        >
          {pending ? "Resetting…" : "Confirm Reset"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-sm text-slate-600 hover:text-slate-800"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
