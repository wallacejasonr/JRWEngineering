import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProject } from "../../actions";
import ProjectForm from "../../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, clients] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
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
  ]);

  if (!project) notFound();

  const action = updateProject.bind(null, project.id);

  return (
    <>
      <div className="mb-6">
        <Link
          href={`/dashboard/projects/${id}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Project
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Project</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        <ProjectForm
          action={action}
          clients={clients}
          cancelHref={`/dashboard/projects/${id}`}
          submitLabel="Save Changes"
          defaults={{
            projectNumber: project.projectNumber,
            name: project.name,
            clientId: project.clientId,
            primaryContactId: project.primaryContactId,
            service: project.service,
            description: project.description,
            location: project.location,
            status: project.status,
          }}
        />
      </div>
    </>
  );
}
