import { Document, Page, StyleSheet, View, Text } from "@react-pdf/renderer";
import {
  CompanyBlock,
  FooterBanner,
  Header,
  InfoRow,
  SectionBanner,
  colors,
  formatDateLong,
  formatDateShort,
  formatMoney,
  styles,
} from "./shared";

const lineItemStyles = StyleSheet.create({
  table: {
    marginTop: 6,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: colors.black,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    paddingVertical: 6,
  },
  emptyRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    height: 22,
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 6,
    backgroundColor: colors.bannerLight,
  },
  cellService: { width: "26%", paddingHorizontal: 4 },
  cellPhase: { width: "26%", paddingHorizontal: 4 },
  cellContract: { width: "16%", paddingHorizontal: 4, textAlign: "right" },
  cellPct: { width: "12%", paddingHorizontal: 4, textAlign: "right" },
  cellAmt: { width: "20%", paddingHorizontal: 4, textAlign: "right" },
  headerCell: { fontFamily: "Helvetica-Bold" },
});

type Company = {
  companyName: string;
  ownerName: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
};

type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceService: string;
  billingFrom: Date | null;
  billingTo: Date | null;
  total: number;
  notes: string | null;
  lineItems: {
    service: string;
    phaseDescription: string;
    contractAmount: number;
    percentComplete: number;
    invoiceAmount: number;
  }[];
  project: {
    projectNumber: string;
    name: string;
    service: string;
    location: string;
  };
  recipient: {
    name: string;
    company: string | null;
    title: string | null;
  };
};

export function InvoicePDF({
  company,
  invoice,
}: {
  company: Company;
  invoice: InvoiceData;
}) {
  const filler = Math.max(0, 4 - invoice.lineItems.length);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Header />
        <CompanyBlock {...company} />

        <Text style={styles.date}>{formatDateLong(invoice.invoiceDate)}</Text>

        <View style={styles.recipient}>
          <Text style={styles.recipientLine}>{invoice.recipient.name}</Text>
          {invoice.recipient.title && (
            <Text style={styles.recipientLine}>{invoice.recipient.title}</Text>
          )}
          {invoice.recipient.company && (
            <Text style={styles.recipientLine}>{invoice.recipient.company}</Text>
          )}
        </View>

        <View style={styles.infoTable}>
          <InfoRow label="Project" value={invoice.project.name} />
          <InfoRow label="Service" value={invoice.project.service} tan />
          <InfoRow label="Location" value={invoice.project.location} />
          <InfoRow label="JRWS Project #" value={invoice.project.projectNumber} />
        </View>

        <View style={styles.infoTable}>
          <InfoRow label="Invoice #" value={invoice.invoiceNumber} tan />
          <InfoRow label="Invoice Service" value={invoice.invoiceService} tan />
          <InfoRow
            label="Invoice Date"
            value={formatDateShort(invoice.invoiceDate)}
          />
          <InfoRow
            label="Billing From"
            value={invoice.billingFrom ? formatDateShort(invoice.billingFrom) : ""}
          />
          <InfoRow
            label="Billing To"
            value={invoice.billingTo ? formatDateShort(invoice.billingTo) : ""}
          />
        </View>

        <Text style={{ marginTop: 14 }}>
          {invoice.recipient.name.split(" ")[0]},
        </Text>
        <Text>Please see the full invoice amount below.</Text>

        <SectionBanner text="Current Invoice" />

        <View style={lineItemStyles.table}>
          <View style={lineItemStyles.headerRow}>
            <Text style={[lineItemStyles.cellService, lineItemStyles.headerCell]}>
              Service
            </Text>
            <Text style={[lineItemStyles.cellPhase, lineItemStyles.headerCell]}>
              Phase Description
            </Text>
            <Text style={[lineItemStyles.cellContract, lineItemStyles.headerCell]}>
              Contract Amt
            </Text>
            <Text style={[lineItemStyles.cellPct, lineItemStyles.headerCell]}>
              % Complete
            </Text>
            <Text style={[lineItemStyles.cellAmt, lineItemStyles.headerCell]}>
              Invoice Amount
            </Text>
          </View>

          {invoice.lineItems.map((item, i) => (
            <View key={i} style={lineItemStyles.row}>
              <Text style={lineItemStyles.cellService}>{item.service}</Text>
              <Text style={lineItemStyles.cellPhase}>{item.phaseDescription}</Text>
              <Text style={lineItemStyles.cellContract}>
                {formatMoney(item.contractAmount)}
              </Text>
              <Text style={lineItemStyles.cellPct}>{item.percentComplete}%</Text>
              <Text style={lineItemStyles.cellAmt}>
                {formatMoney(item.invoiceAmount)}
              </Text>
            </View>
          ))}

          {Array.from({ length: filler }).map((_, i) => (
            <View key={`empty-${i}`} style={lineItemStyles.emptyRow} />
          ))}

          <View style={lineItemStyles.totalRow}>
            <Text
              style={[
                {
                  width: "80%",
                  paddingHorizontal: 4,
                  textAlign: "right",
                  fontFamily: "Helvetica-Bold",
                },
              ]}
            >
              Total of Services Provided:
            </Text>
            <Text
              style={[
                lineItemStyles.cellAmt,
                { fontFamily: "Helvetica-Bold" },
              ]}
            >
              {formatMoney(invoice.total)}
            </Text>
          </View>
        </View>

        <Text style={{ marginTop: 10 }}>
          Please provide a check made out to {company.companyName} in the amount
          of {formatMoney(invoice.total)} and forward it to my address noted
          above. It was a pleasure working with you on this project.
        </Text>

        {invoice.notes && (
          <Text style={{ marginTop: 10, fontStyle: "italic" }}>
            {invoice.notes}
          </Text>
        )}

        <Text style={styles.signature}>
          {company.ownerName} {company.title}
        </Text>

        <FooterBanner />
      </Page>
    </Document>
  );
}
