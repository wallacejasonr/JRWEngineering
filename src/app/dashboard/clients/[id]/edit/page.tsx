import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditClientForm from "./EditClientForm";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/dashboard/clients/${id}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Client
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Client</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        <EditClientForm client={client} />
      </div>
    </>
  );
}
