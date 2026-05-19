import { prisma } from "@/lib/prisma";

function currentYearSuffix(): string {
  return String(new Date().getFullYear()).slice(-2);
}

export async function nextProjectNumber(): Promise<string> {
  const yy = currentYearSuffix();
  const prefix = `${yy}-`;

  const latest = await prisma.project.findFirst({
    where: { projectNumber: { startsWith: prefix } },
    orderBy: { projectNumber: "desc" },
    select: { projectNumber: true },
  });

  let nextSeq = 1;
  if (latest) {
    const seq = parseInt(latest.projectNumber.slice(prefix.length), 10);
    if (!Number.isNaN(seq)) nextSeq = seq + 1;
  }

  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}

export async function nextInvoiceNumber(): Promise<string> {
  const yy = currentYearSuffix();
  const prefix = `JRWE-${yy}-`;

  const latest = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: "desc" },
    select: { invoiceNumber: true },
  });

  let nextSeq = 1;
  if (latest) {
    const seq = parseInt(latest.invoiceNumber.slice(prefix.length), 10);
    if (!Number.isNaN(seq)) nextSeq = seq + 1;
  }

  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}

export async function nextQuoteNumber(): Promise<string> {
  const yy = currentYearSuffix();
  const prefix = `Q-${yy}-`;

  const latest = await prisma.quote.findFirst({
    where: { quoteNumber: { startsWith: prefix } },
    orderBy: { quoteNumber: "desc" },
    select: { quoteNumber: true },
  });

  let nextSeq = 1;
  if (latest) {
    const seq = parseInt(latest.quoteNumber.slice(prefix.length), 10);
    if (!Number.isNaN(seq)) nextSeq = seq + 1;
  }

  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}
