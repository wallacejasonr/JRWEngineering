import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuotePDF } from "@/lib/pdf/QuotePDF";
import { getCompanyProfile } from "@/lib/pdf/company";
import { buildPdfFilename } from "@/lib/pdf/filename";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [quote, company] = await Promise.all([
    prisma.quote.findUnique({
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

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contact =
    quote.project.primaryContact ?? quote.project.client.contacts[0] ?? null;

  const buffer = await renderToBuffer(
    <QuotePDF
      company={company}
      quote={{
        quoteNumber: quote.quoteNumber,
        date: quote.date,
        fee: quote.fee.toNumber(),
        inclusions: quote.inclusions,
        exclusions: quote.exclusions,
        billingTerms: quote.billingTerms,
        project: {
          projectNumber: quote.project.projectNumber,
          name: quote.project.name,
          service: quote.project.service,
          location: quote.project.location,
        },
        recipient: {
          name: contact
            ? `${contact.firstName} ${contact.lastName}`
            : (quote.project.client.companyName ?? "Client"),
          company: quote.project.client.companyName,
          title: contact?.title ?? null,
        },
      }}
    />
  );

  const filename = buildPdfFilename({
    projectName: quote.project.name,
    type: "Quote",
    number: quote.quoteNumber,
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
