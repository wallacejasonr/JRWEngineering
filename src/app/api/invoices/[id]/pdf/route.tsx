import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoicePDF } from "@/lib/pdf/InvoicePDF";
import { getCompanyProfile } from "@/lib/pdf/company";

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
        lineItems: { orderBy: { sortOrder: "asc" } },
      },
    }),
    getCompanyProfile(),
  ]);

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contact =
    invoice.project.primaryContact ??
    invoice.project.client.contacts[0] ??
    null;

  const buffer = await renderToBuffer(
    <InvoicePDF
      company={company}
      invoice={{
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        invoiceService: invoice.invoiceService,
        total: invoice.total.toNumber(),
        notes: invoice.notes,
        lineItems: invoice.lineItems.map((item) => ({
          service: item.service,
          phaseDescription: item.phaseDescription,
          contractAmount: item.contractAmount.toNumber(),
          percentComplete: item.percentComplete.toNumber(),
          invoiceAmount: item.invoiceAmount.toNumber(),
        })),
        project: {
          projectNumber: invoice.project.projectNumber,
          name: invoice.project.name,
          service: invoice.project.service,
          location: invoice.project.location,
        },
        recipient: {
          name: contact
            ? `${contact.firstName} ${contact.lastName}`
            : (invoice.project.client.companyName ?? "Client"),
          company: invoice.project.client.companyName,
          title: contact?.title ?? null,
        },
      }}
    />
  );

  const filename = `${invoice.invoiceNumber}.pdf`;
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
