"use client";

import { useActionState, useRef, useState } from "react";
import {
  addLineItem,
  deleteLineItem,
  updateLineItem,
} from "../actions";
import { emptyFormState } from "@/lib/form-state";

type LineItem = {
  id: string;
  service: string;
  phaseDescription: string;
  contractAmount: string;
  percentComplete: string;
  invoiceAmount: string;
};

function formatMoney(value: string): string {
  const n = parseFloat(value);
  if (isNaN(n)) return value;
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function LineItemsSection({
  invoiceId,
  lineItems,
  total,
  editable,
}: {
  invoiceId: string;
  lineItems: LineItem[];
  total: string;
  editable: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-x-auto">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Line Items</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left px-6 py-3 font-semibold text-slate-600">Service</th>
            <th className="text-left px-6 py-3 font-semibold text-slate-600">Phase Description</th>
            <th className="text-right px-6 py-3 font-semibold text-slate-600">Contract</th>
            <th className="text-right px-6 py-3 font-semibold text-slate-600">% Complete</th>
            <th className="text-right px-6 py-3 font-semibold text-slate-600">Invoice Amt</th>
            {editable && <th className="px-6 py-3"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {lineItems.map((item) => (
            <LineItemRow
              key={item.id}
              item={item}
              invoiceId={invoiceId}
              editable={editable}
            />
          ))}
          {lineItems.length === 0 && (
            <tr>
              <td colSpan={editable ? 6 : 5} className="px-6 py-8 text-center text-slate-500">
                No line items yet.
              </td>
            </tr>
          )}
          <tr className="bg-slate-50 font-semibold">
            <td colSpan={editable ? 5 : 4} className="px-6 py-4 text-right text-slate-900">
              Total
            </td>
            <td className="px-6 py-4 text-right text-slate-900">
              {formatMoney(total)}
            </td>
            {editable && <td></td>}
          </tr>
        </tbody>
      </table>

      {editable && <AddLineItemForm invoiceId={invoiceId} />}
    </div>
  );
}

function LineItemRow({
  item,
  invoiceId,
  editable,
}: {
  item: LineItem;
  invoiceId: string;
  editable: boolean;
}) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <tr className="hover:bg-slate-50">
        <td className="px-6 py-4 text-slate-900">{item.service}</td>
        <td className="px-6 py-4 text-slate-700">{item.phaseDescription}</td>
        <td className="px-6 py-4 text-right text-slate-700">
          {formatMoney(item.contractAmount)}
        </td>
        <td className="px-6 py-4 text-right text-slate-700">
          {item.percentComplete}%
        </td>
        <td className="px-6 py-4 text-right font-medium text-slate-900">
          {formatMoney(item.invoiceAmount)}
        </td>
        {editable && (
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <form
                action={async () => {
                  if (confirm("Delete this line item?")) {
                    await deleteLineItem(invoiceId, item.id);
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
            </div>
          </td>
        )}
      </tr>
    );
  }

  return (
    <tr className="bg-blue-50">
      <td colSpan={6} className="px-6 py-4">
        <EditLineItemForm
          item={item}
          invoiceId={invoiceId}
          onDone={() => setEditing(false)}
        />
      </td>
    </tr>
  );
}

function EditLineItemForm({
  item,
  invoiceId,
  onDone,
}: {
  item: LineItem;
  invoiceId: string;
  onDone: () => void;
}) {
  async function action(formData: FormData) {
    await updateLineItem(invoiceId, item.id, formData);
    onDone();
  }

  return (
    <form action={action} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
      <input
        name="service"
        type="text"
        defaultValue={item.service}
        required
        placeholder="Service"
        className={inputClass}
      />
      <input
        name="phaseDescription"
        type="text"
        defaultValue={item.phaseDescription}
        required
        placeholder="Phase"
        className={inputClass}
      />
      <input
        name="contractAmount"
        type="number"
        step="0.01"
        defaultValue={item.contractAmount}
        required
        placeholder="Contract"
        className={inputClass}
      />
      <input
        name="percentComplete"
        type="number"
        step="0.01"
        min="0"
        max="100"
        defaultValue={item.percentComplete}
        required
        placeholder="%"
        className={inputClass}
      />
      <input
        name="invoiceAmount"
        type="number"
        step="0.01"
        defaultValue={item.invoiceAmount}
        required
        placeholder="Invoice"
        className={inputClass}
      />
      <div className="sm:col-span-5 flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-xs text-slate-600 hover:text-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddLineItemForm({ invoiceId }: { invoiceId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = addLineItem.bind(null, invoiceId);
  const [state, formAction, pending] = useActionState(action, emptyFormState);

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Add Line Item</h3>
      <form
        ref={formRef}
        action={formAction}
        className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end"
      >
        <input name="service" type="text" required placeholder="Service" className={inputClass} />
        <input
          name="phaseDescription"
          type="text"
          required
          placeholder="Phase description"
          className={inputClass}
        />
        <input
          name="contractAmount"
          type="number"
          step="0.01"
          required
          placeholder="Contract"
          className={inputClass}
        />
        <input
          name="percentComplete"
          type="number"
          step="0.01"
          min="0"
          max="100"
          required
          placeholder="% complete"
          className={inputClass}
        />
        <input
          name="invoiceAmount"
          type="number"
          step="0.01"
          required
          placeholder="Invoice amt"
          className={inputClass}
        />
        <div className="sm:col-span-5">
          {state.message && !state.ok && (
            <p className="text-xs text-red-600 mb-2">{state.message}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-medium px-3 py-1.5 rounded-md"
          >
            {pending ? "Adding…" : "Add Line Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";
