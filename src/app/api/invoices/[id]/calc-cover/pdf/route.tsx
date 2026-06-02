import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalcCoverPDF } from "@/lib/pdf/CalcCoverPDF";
import { getCompanyProfile } from "@/lib/pdf/company";
import { buildPdfFilename } from "@/lib/pdf/filename";

async function loadSignature(): Promise<Buffer | undefined> {
  try {
    return await readFile(path.join(process.cwd(), "public", "signature.png"));
  } catch {
    return undefined;
  }
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
  const [invoice, company, signatureImage] = await Promise.all([
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
    loadSignature(),
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
      signatureImage={signatureImage}
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

  const filename = buildPdfFilename({
    projectName: invoice.project.name,
    type: "Calcs Cover",
  });
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
