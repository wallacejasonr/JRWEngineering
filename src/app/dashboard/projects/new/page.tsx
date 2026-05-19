import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { nextProjectNumber } from "@/lib/numbering";
import { createProject } from "../actions";
import ProjectForm from "../ProjectForm";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId: preselectedClientId } = await searchParams;

  const [clients, suggestedNumber] = await Promise.all([
    prisma.client.findMany({
      where: { archivedAt: null },
      orderBy: { companyName: "asc" },
      include: {
        contacts: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
          select: { id: true, firstName: true, lastName: true, isPrimary: true },
        },
      },
    }),
    nextProjectNumber(),
  ]);

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard/projects"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Projects
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Project</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        {clients.length === 0 ? (
          <p className="text-sm text-slate-600">
            You need to create a client first.{" "}
            <Link href="/dashboard/clients/new" className="text-blue-600 hover:text-blue-800">
              Create a client →
            </Link>
          </p>
        ) : (
          <ProjectForm
            action={createProject}
            clients={clients}
            cancelHref="/dashboard/projects"
            submitLabel="Create Project"
            defaults={{
              projectNumber: suggestedNumber,
              name: "",
              clientId: preselectedClientId ?? "",
              primaryContactId: null,
              service: "",
              description: null,
              location: "",
              status: "active",
            }}
          />
        )}
      </div>
    </>
  );
}
