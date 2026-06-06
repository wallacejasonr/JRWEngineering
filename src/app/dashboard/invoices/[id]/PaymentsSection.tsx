"use client";

import { useActionState, useRef } from "react";
import { deletePayment, recordPayment } from "../actions";
import { emptyFormState } from "@/lib/form-state";

type Payment = {
  id: string;
  amount: string;
  receivedDateInputValue: string;
  receivedDateDisplay: string;
  method: "check" | "ach" | "cash" | "card" | "other";
  reference: string | null;
  notes: string | null;
};

function formatMoney(value: string): string {
  const n = parseFloat(value);
  if (isNaN(n)) return value;
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function methodLabel(m: Payment["method"]): string {
  switch (m) {
    case "check":
      return "Check";
    case "ach":
      return "ACH";
    case "cash":
      return "Cash";
    case "card":
      return "Card";
    case "other":
      return "Other";
  }
}

export default function PaymentsSection({
  invoiceId,
  payments,
  paidSum,
  total,
  balanceDue,
  defaultAmount,
  defaultReceivedDate,
  canRecord,
  canDelete,
}: {
  invoiceId: string;
  payments: Payment[];
  paidSum: string;
  total: string;
  balanceDue: string;
  defaultAmount: string;
  defaultReceivedDate: string;
  canRecord: boolean;
  canDelete: boolean;
}) {
  void total;
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-x-auto">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Payments</h2>
      </div>
      {payments.length === 0 ? (
        <p className="px-6 py-6 text-sm text-slate-500">No payments recorded yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-600">Date</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">Method</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600">Reference</th>
              <th className="text-right px-6 py-3 font-semibold text-slate-600">Amount</th>
              {canDelete && <th className="px-6 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <PaymentRow
                key={p.id}
                payment={p}
                invoiceId={invoiceId}
                canDelete={canDelete}
              />
            ))}
            <tr className="bg-slate-50 font-semibold">
              <td colSpan={3} className="px-6 py-3 text-right text-slate-700">
                Paid
              </td>
              <td className="px-6 py-3 text-right text-slate-900">
                {formatMoney(paidSum)}
              </td>
              {canDelete && <td></td>}
            </tr>
            <tr className="bg-slate-50 font-semibold">
              <td colSpan={3} className="px-6 py-3 text-right text-slate-700">
                Balance
              </td>
              <td className="px-6 py-3 text-right text-slate-900">
                {formatMoney(balanceDue)}
              </td>
              {canDelete && <td></td>}
            </tr>
          </tbody>
        </table>
      )}
      {canRecord && parseFloat(balanceDue) > 0 && (
        <AddPaymentForm
          invoiceId={invoiceId}
          defaultAmount={defaultAmount}
          defaultReceivedDate={defaultReceivedDate}
        />
      )}
    </div>
  );
}

function PaymentRow({
  payment,
  invoiceId,
  canDelete,
}: {
  payment: Payment;
  invoiceId: string;
  canDelete: boolean;
}) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-4 text-slate-900">{payment.receivedDateDisplay}</td>
      <td className="px-6 py-4 text-slate-700">{methodLabel(payment.method)}</td>
      <td className="px-6 py-4 text-slate-700">{payment.reference ?? "—"}</td>
      <td className="px-6 py-4 text-right font-medium text-slate-900">
        {formatMoney(payment.amount)}
      </td>
      {canDelete && (
        <td className="px-6 py-4 text-right">
          <form
            action={async () => {
              if (confirm("Delete this payment?")) {
                await deletePayment(invoiceId, payment.id);
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
        </td>
      )}
    </tr>
  );
}

function AddPaymentForm({
  invoiceId,
  defaultAmount,
  defaultReceivedDate,
}: {
  invoiceId: string;
  defaultAmount: string;
  defaultReceivedDate: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = recordPayment.bind(null, invoiceId);
  const [state, formAction, pending] = useActionState(action, emptyFormState);

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Record Payment</h3>
      <form
        ref={formRef}
        action={formAction}
        className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end"
      >
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          defaultValue={defaultAmount}
          placeholder="Amount"
          className={inputClass}
        />
        <input
          name="receivedDate"
          type="date"
          required
          defaultValue={defaultReceivedDate}
          className={inputClass}
        />
        <select name="method" required defaultValue="check" className={inputClass}>
          <option value="check">Check</option>
          <option value="ach">ACH</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="other">Other</option>
        </select>
        <input
          name="reference"
          type="text"
          placeholder="Reference (e.g. check #)"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium px-3 py-1.5 rounded-md"
        >
          {pending ? "Recording…" : "Record Payment"}
        </button>
        <div className="sm:col-span-5">
          <input
            name="notes"
            type="text"
            placeholder="Notes (optional)"
            className={`${inputClass} w-full`}
          />
        </div>
        {state.message && !state.ok && (
          <p className="sm:col-span-5 text-xs text-red-600">{state.message}</p>
        )}
      </form>
    </div>
  );
}

const inputClass =
  "rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";
