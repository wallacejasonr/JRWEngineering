import { PrismaClient, UserRole, ProjectStatus, QuoteStatus, InvoiceStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Hash a default password for all seed users
  const defaultPassword = await bcrypt.hash("password123", 10);

  // -------------------------------------------------------------------------
  // 1. Company Profile (singleton)
  // -------------------------------------------------------------------------
  const companyProfile = await prisma.companyProfile.create({
    data: {
      companyName: "JRW Engineering",
      ownerName: "Jason R Wallace",
      title: "PE",
      address: "1247 E Georgia",
      city: "Phoenix",
      state: "AZ",
      zip: "85014",
      phone: "602.680.9831",
      email: "jason@jrwengineering.com",
      peCertNumber: "52637",
    },
  });
  console.log("  Created company profile:", companyProfile.companyName);

  // -------------------------------------------------------------------------
  // 2. Staff Users
  // -------------------------------------------------------------------------
  const jason = await prisma.user.create({
    data: {
      name: "Jason Wallace",
      email: "jason@jrwengineering.com",
      hashedPassword: defaultPassword,
      role: UserRole.admin,
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "sarah@jrwengineering.com",
      hashedPassword: defaultPassword,
      role: UserRole.user,
    },
  });

  const marcus = await prisma.user.create({
    data: {
      name: "Marcus Rivera",
      email: "marcus@jrwengineering.com",
      hashedPassword: defaultPassword,
      role: UserRole.user,
    },
  });

  console.log("  Created 3 staff users");

  // -------------------------------------------------------------------------
  // 3. Clients & Contacts
  // -------------------------------------------------------------------------

  // Client: Sandbox Projects (company)
  const sandboxClient = await prisma.client.create({
    data: {
      companyName: "Sandbox Projects",
      email: "info@sandboxprojects.com",
      phone: "480.555.1234",
      address: "2100 N Central Ave",
      city: "Phoenix",
      state: "AZ",
      zip: "85004",
    },
  });

  const miguelContact = await prisma.contact.create({
    data: {
      clientId: sandboxClient.id,
      firstName: "Miguel",
      lastName: "Solorio",
      email: "miguel@sandboxprojects.com",
      phone: "480.555.1235",
      isPrimary: true,
    },
  });

  // Client: Origin Design and Tech (company)
  const originClient = await prisma.client.create({
    data: {
      companyName: "Origin Design and Tech",
      email: "info@origindesigntech.com",
      phone: "602.555.5678",
      address: "4500 S Mill Ave",
      city: "Tempe",
      state: "AZ",
      zip: "85282",
    },
  });

  const kyleContact = await prisma.contact.create({
    data: {
      clientId: originClient.id,
      firstName: "Kyle",
      lastName: "Taylor",
      email: "kyle@origindesigntech.com",
      phone: "602.555.5679",
      isPrimary: true,
    },
  });

  // Client: David Bostic (individual — no companyName)
  const bosticClient = await prisma.client.create({
    data: {
      companyName: null,
      email: "david.bostic@email.com",
      phone: "623.555.9012",
      address: "49202 7th Ave",
      city: "New River",
      state: "AZ",
      zip: "58087",
    },
  });

  const bosticContact = await prisma.contact.create({
    data: {
      clientId: bosticClient.id,
      firstName: "David",
      lastName: "Bostic",
      email: "david.bostic@email.com",
      phone: "623.555.9012",
      title: "Project Owner",
      isPrimary: true,
    },
  });

  // Client: Valley General Contractors (company)
  const valleyClient = await prisma.client.create({
    data: {
      companyName: "Valley General Contractors",
      email: "office@valleygc.com",
      phone: "480.555.3456",
      address: "7890 E Camelback Rd",
      city: "Scottsdale",
      state: "AZ",
      zip: "85251",
    },
  });

  const lisaContact = await prisma.contact.create({
    data: {
      clientId: valleyClient.id,
      firstName: "Lisa",
      lastName: "Nguyen",
      email: "lisa@valleygc.com",
      phone: "480.555.3457",
      title: "Project Manager",
      isPrimary: true,
    },
  });

  console.log("  Created 4 clients with contacts");

  // -------------------------------------------------------------------------
  // 4. Projects
  // -------------------------------------------------------------------------

  const biscuitsProject = await prisma.project.create({
    data: {
      projectNumber: "25-063",
      name: "Biscuits Cafe Mech Support",
      clientId: sandboxClient.id,
      primaryContactId: miguelContact.id,
      service: "Mechanical Support Design",
      description: "Mechanical support design for Biscuits Cafe new location",
      location: "N Verrado Way & Roosevelt St Buckeye Az",
      status: ProjectStatus.active,
      createdById: jason.id,
    },
  });

  const bosticProject = await prisma.project.create({
    data: {
      projectNumber: "25-013",
      name: "Bostic Add Services",
      clientId: bosticClient.id,
      primaryContactId: bosticContact.id,
      service: "Calculations for Horse Barn and Shed",
      description: "Structural calculations for residential horse barn and storage shed addition",
      location: "49202 7th Ave New River Az 58087",
      status: ProjectStatus.active,
      createdById: jason.id,
    },
  });

  const kyreneProject = await prisma.project.create({
    data: {
      projectNumber: "26-001",
      name: "Kyrene Electrical Yard Canopy Design",
      clientId: originClient.id,
      primaryContactId: kyleContact.id,
      service: "Canopy Design",
      description: "Structural design for electrical yard canopy at Kyrene substation",
      location: "Kyrene Rd & Warner Rd Tempe Az",
      status: ProjectStatus.active,
      createdById: jason.id,
    },
  });

  const valleyProject = await prisma.project.create({
    data: {
      projectNumber: "25-045",
      name: "Mesa Office TI Structural",
      clientId: valleyClient.id,
      primaryContactId: lisaContact.id,
      service: "Structural Engineering",
      description: "Tenant improvement structural modifications for office buildout",
      location: "1234 W Main St Mesa Az 85201",
      status: ProjectStatus.completed,
      createdById: sarah.id,
    },
  });

  const sandboxProject2 = await prisma.project.create({
    data: {
      projectNumber: "25-071",
      name: "Desert Ridge Retail Pad",
      clientId: sandboxClient.id,
      primaryContactId: miguelContact.id,
      service: "Civil Site Design",
      description: "Civil site design and grading plan for retail pad site",
      location: "Tatum Blvd & Loop 101 Phoenix Az",
      status: ProjectStatus.on_hold,
      createdById: marcus.id,
    },
  });

  console.log("  Created 5 projects");

  // -------------------------------------------------------------------------
  // 5. Quotes
  // -------------------------------------------------------------------------

  // Quote for Biscuits Cafe — draft
  const biscuitsQuote = await prisma.quote.create({
    data: {
      quoteNumber: "Q-25-063",
      projectId: biscuitsProject.id,
      createdById: jason.id,
      date: new Date("2025-06-15"),
      inclusions: [
        "Structural calculations with sealed cover sheet",
        "Drawing and Detail Redlines",
        "RFI Coordination",
        "Minor Changes",
      ],
      exclusions: [
        "Special Inspections",
        "Weld Inspections",
        "Excessive Changes",
        "Site Visits ($400 each if required and 3 days min notice)",
      ],
      fee: 1500.0,
      billingTerms: "Project will be billed 100% at time of submission",
      status: QuoteStatus.sent,
      sentAt: new Date("2025-06-16"),
    },
  });

  // Quote for Bostic — approved
  const bosticQuote = await prisma.quote.create({
    data: {
      quoteNumber: "Q-25-013",
      projectId: bosticProject.id,
      createdById: jason.id,
      date: new Date("2025-03-01"),
      inclusions: [
        "Structural calculations for horse barn",
        "Structural calculations for shed",
        "Sealed cover sheet for each structure",
        "Foundation design",
        "Drawing and Detail Redlines",
      ],
      exclusions: [
        "Special Inspections",
        "Weld Inspections",
        "Excessive Changes",
        "Site Visits ($400 each if required and 3 days min notice)",
        "Geotechnical Report (by others)",
      ],
      fee: 2000.0,
      billingTerms: "Project will be billed 50% at start and 50% at submission",
      status: QuoteStatus.approved,
      sentAt: new Date("2025-03-02"),
      approvedAt: new Date("2025-03-05"),
    },
  });

  // Quote for Kyrene — draft
  await prisma.quote.create({
    data: {
      quoteNumber: "Q-26-001",
      projectId: kyreneProject.id,
      createdById: jason.id,
      date: new Date("2026-01-10"),
      inclusions: [
        "Canopy structural design",
        "Sealed structural calculations",
        "Connection design details",
        "Foundation design",
        "Drawing and Detail Redlines",
        "RFI Coordination",
      ],
      exclusions: [
        "Special Inspections",
        "Weld Inspections",
        "Excessive Changes",
        "Electrical design (by others)",
        "Site Visits ($400 each if required and 3 days min notice)",
      ],
      fee: 3500.0,
      billingTerms: "Project will be billed 100% at time of submission",
      status: QuoteStatus.draft,
    },
  });

  // Quote for Mesa Office TI — approved
  const valleyQuote = await prisma.quote.create({
    data: {
      quoteNumber: "Q-25-045",
      projectId: valleyProject.id,
      createdById: sarah.id,
      date: new Date("2025-05-01"),
      inclusions: [
        "Structural analysis of existing conditions",
        "Structural calculations for modifications",
        "Sealed cover sheet",
        "Drawing and Detail Redlines",
        "RFI Coordination",
        "Minor Changes",
      ],
      exclusions: [
        "Special Inspections",
        "Weld Inspections",
        "Excessive Changes",
        "Site Visits ($400 each if required and 3 days min notice)",
      ],
      fee: 2500.0,
      billingTerms: "Project will be billed 100% at time of submission",
      status: QuoteStatus.approved,
      sentAt: new Date("2025-05-02"),
      approvedAt: new Date("2025-05-05"),
    },
  });

  console.log("  Created 4 quotes");

  // -------------------------------------------------------------------------
  // 6. Invoices with Line Items
  // -------------------------------------------------------------------------

  // Invoice for Bostic — paid (linked to approved quote)
  const bosticInvoice = await prisma.invoice.create({
    data: {
      invoiceNumber: "JRWE-25-013",
      projectId: bosticProject.id,
      quoteId: bosticQuote.id,
      createdById: jason.id,
      invoiceDate: new Date("2025-04-15"),
      billingFrom: new Date("2025-03-05"),
      billingTo: new Date("2025-04-15"),
      invoiceService: "Design",
      total: 2000.0,
      status: InvoiceStatus.paid,
      dueDate: new Date("2025-05-15"),
      sentAt: new Date("2025-04-16"),
      paidAt: new Date("2025-04-28"),
    },
  });

  await prisma.invoiceLineItem.createMany({
    data: [
      {
        invoiceId: bosticInvoice.id,
        service: "Structural Calcs",
        phaseDescription: "Compensation",
        contractAmount: 2000.0,
        percentComplete: 100.0,
        invoiceAmount: 2000.0,
        sortOrder: 1,
      },
    ],
  });

  // Invoice for Mesa Office TI — sent (linked to approved quote)
  const valleyInvoice = await prisma.invoice.create({
    data: {
      invoiceNumber: "JRWE-25-045",
      projectId: valleyProject.id,
      quoteId: valleyQuote.id,
      createdById: sarah.id,
      invoiceDate: new Date("2025-08-01"),
      billingFrom: new Date("2025-05-05"),
      billingTo: new Date("2025-07-31"),
      invoiceService: "Design",
      total: 2500.0,
      status: InvoiceStatus.sent,
      dueDate: new Date("2025-09-01"),
      sentAt: new Date("2025-08-02"),
    },
  });

  await prisma.invoiceLineItem.createMany({
    data: [
      {
        invoiceId: valleyInvoice.id,
        service: "Structural Engineering",
        phaseDescription: "Analysis & Design",
        contractAmount: 1500.0,
        percentComplete: 100.0,
        invoiceAmount: 1500.0,
        sortOrder: 1,
      },
      {
        invoiceId: valleyInvoice.id,
        service: "Structural Engineering",
        phaseDescription: "Drawing Redlines",
        contractAmount: 750.0,
        percentComplete: 100.0,
        invoiceAmount: 750.0,
        sortOrder: 2,
      },
      {
        invoiceId: valleyInvoice.id,
        service: "Structural Engineering",
        phaseDescription: "RFI Coordination",
        contractAmount: 250.0,
        percentComplete: 100.0,
        invoiceAmount: 250.0,
        sortOrder: 3,
      },
    ],
  });

  // Invoice for Biscuits Cafe — draft (not yet linked to a quote)
  const biscuitsInvoice = await prisma.invoice.create({
    data: {
      invoiceNumber: "JRWE-25-063",
      projectId: biscuitsProject.id,
      createdById: jason.id,
      invoiceDate: new Date("2025-07-01"),
      invoiceService: "Design",
      total: 750.0,
      status: InvoiceStatus.draft,
      notes: "Progress billing - 50% of mechanical support design",
    },
  });

  await prisma.invoiceLineItem.createMany({
    data: [
      {
        invoiceId: biscuitsInvoice.id,
        service: "Mechanical Support Design",
        phaseDescription: "Compensation",
        contractAmount: 1500.0,
        percentComplete: 50.0,
        invoiceAmount: 750.0,
        sortOrder: 1,
      },
    ],
  });

  console.log("  Created 3 invoices with line items");

  console.log("\nSeeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
