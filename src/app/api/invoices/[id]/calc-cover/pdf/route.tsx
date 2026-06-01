import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalcCoverPDF } from "@/lib/pdf/CalcCoverPDF";
import { getCompanyProfile } from "@/lib/pdf/company";

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^A-Za-z0-9-_ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [invoice, company] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            client: {
              include: {
                contacts: {
                  orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
                  take: 1,
                },
              },
            },
            primaryContact: true,
          },
        },
      },
    }),
    getCompanyProfile(),
  ]);

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const client = invoice.project.client;
  const contact = invoice.project.primaryContact ?? client.contacts[0] ?? null;
  const fallbackName = client.companyName ?? "Client";

  const buffer = await renderToBuffer(
    <CalcCoverPDF
      company={company}
      cover={{
        projectName: invoice.project.name,
        date: new Date(),
        recipient: {
          name: contact
            ? `${contact.firstName} ${contact.lastName}`
            : fallbackName,
          firstName: contact?.firstName ?? fallbackName,
          company: client.companyName,
        },
      }}
    />
  );

  const safeProjectName = sanitizeFilename(invoice.project.name) || "Project";
  const filename = `${safeProjectName} Calcs Cover.pdf`;
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
