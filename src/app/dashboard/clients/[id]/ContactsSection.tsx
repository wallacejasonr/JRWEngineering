"use client";

import { useActionState, useRef } from "react";
import {
  addContact,
  deleteContact,
  setPrimaryContact,
} from "../actions";
import { emptyFormState } from "@/lib/form-state";

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  isPrimary: boolean;
};

export default function ContactsSection({
  clientId,
  contacts,
}: {
  clientId: string;
  contacts: Contact[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = addContact.bind(null, clientId);
  const [state, formAction, pending] = useActionState(action, emptyFormState);

  // Reset on success
  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Contacts</h2>
      </div>

      <div className="divide-y divide-slate-100">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="px-6 py-4 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900">
                {contact.firstName} {contact.lastName}
                {contact.isPrimary && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
              </p>
              {contact.title && (
                <p className="text-sm text-slate-500">{contact.title}</p>
              )}
            </div>
            <div className="text-sm text-slate-600 text-right">
              {contact.email && <p>{contact.email}</p>}
              {contact.phone && <p>{contact.phone}</p>}
            </div>
            <div className="flex items-center gap-2 ml-4">
              {!contact.isPrimary && (
                <>
                  <form
                    action={async () => {
                      await setPrimaryContact(clientId, contact.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Make primary
                    </button>
                  </form>
                  <form
                    action={async () => {
                      if (confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
                        await deleteContact(clientId, contact.id);
                      }
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Add Contact</h3>
        <form ref={formRef} action={formAction} className="space-y-3">
          {state.message && (
            <div
              className={`text-sm rounded-md px-3 py-2 ${state.ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}
            >
              {state.message}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="firstName"
              type="text"
              required
              placeholder="First name"
              className={inputClass}
            />
            <input
              name="lastName"
              type="text"
              required
              placeholder="Last name"
              className={inputClass}
            />
          </div>
          <input
            name="title"
            type="text"
            placeholder="Title (optional)"
            className={inputClass}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="email"
              type="email"
              placeholder="Email (optional)"
              className={inputClass}
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone (optional)"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            {pending ? "Adding…" : "Add Contact"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";
