import Link from "next/link";
import NewClientForm from "./ClientForm";

export default function NewClientPage() {
  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/clients"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Clients
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Client</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        <NewClientForm />
      </div>
    </>
  );
}
