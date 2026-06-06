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
  total: number;
  paidSum: number;
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
  const balance = Math.max(0, invoice.total - invoice.paidSum);
  const showPaid = invoice.paidSum > 0;
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Header />
        <CompanyBlock {...company} />

        <Text style={styles.date}>{formatDateLong(invoice.invoiceDate)}</Text>

        <View style={styles.recipient}>
          <Text style={styles.recipientLine}>
            {invoice.recipient.title
              ? `${invoice.recipient.name}, ${invoice.recipient.title}`
              : invoice.recipient.name}
          </Text>
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
        </View>

        <Text style={{ marginTop: 14 }}>
          {invoice.recipient.name.split(" ")[0]},
        </Text>

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
              %
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
        </View>

        <View style={{ marginTop: 12, alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ width: 120, textAlign: "right", paddingRight: 8 }}>Subtotal:</Text>
            <Text style={{ width: 90, textAlign: "right", fontFamily: "Helvetica-Bold" }}>
              {formatMoney(invoice.total)}
            </Text>
          </View>
          {showPaid && (
            <View style={{ flexDirection: "row", marginTop: 2 }}>
              <Text style={{ width: 120, textAlign: "right", paddingRight: 8 }}>Payments Received:</Text>
              <Text style={{ width: 90, textAlign: "right" }}>
                -{formatMoney(invoice.paidSum)}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", marginTop: 4, paddingTop: 4, borderTopWidth: 0.5, borderColor: colors.black }}>
            <Text style={{ width: 120, textAlign: "right", paddingRight: 8, fontFamily: "Helvetica-Bold" }}>
              Balance Due:
            </Text>
            <Text style={{ width: 90, textAlign: "right", fontFamily: "Helvetica-Bold" }}>
              {formatMoney(balance)}
            </Text>
          </View>
        </View>

        <Text style={{ marginTop: 10 }}>
          {balance > 0
            ? `Please provide a check made out to ${company.companyName} in the amount of ${formatMoney(balance)} and forward it to my address noted above. It was a pleasure working with you on this project.`
            : `Thank you for your payment. It was a pleasure working with you on this project.`}
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
