import { Document, Page, View, Text } from "@react-pdf/renderer";
import {
  CompanyBlock,
  FooterBanner,
  Header,
  InfoRow,
  SectionBanner,
  formatDateLong,
  formatMoney,
  styles,
} from "./shared";
import { SsiFeeSchedulePages } from "./SsiFeeSchedule";

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

type QuoteData = {
  quoteNumber: string;
  date: Date;
  fee: number;
  inclusions: string[];
  exclusions: string[];
  billingTerms: string;
  feeSchedule: {
    siteVisitRate: number;
    additionalHourlyRate: number;
    reportRate: number;
  };
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

export function QuotePDF({
  company,
  quote,
}: {
  company: Company;
  quote: QuoteData;
}) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Header />
        <CompanyBlock {...company} />

        <Text style={styles.date}>{formatDateLong(quote.date)}</Text>

        <View style={styles.recipient}>
          <Text style={styles.recipientLine}>{quote.recipient.name}</Text>
          {quote.recipient.title && (
            <Text style={styles.recipientLine}>{quote.recipient.title}</Text>
          )}
          {quote.recipient.company && (
            <Text style={styles.recipientLine}>{quote.recipient.company}</Text>
          )}
        </View>

        <View style={styles.infoTable}>
          <InfoRow label="Project" value={quote.project.name} />
          <InfoRow label="Service" value={quote.project.service} tan />
          <InfoRow label="Location" value={quote.project.location} />
          <InfoRow label="JRWS Project #" value={quote.project.projectNumber} />
        </View>

        <SectionBanner text="Quote Description" />

        {quote.inclusions.length > 0 && (
          <>
            <Text style={styles.listLabel}>Inclusions:</Text>
            {quote.inclusions.map((item, i) => (
              <View key={`inc-${i}`} style={styles.listItem}>
                <Text style={styles.listBullet}>-</Text>
                <Text style={{ flex: 1 }}>{item}</Text>
              </View>
            ))}
          </>
        )}

        {quote.exclusions.length > 0 && (
          <>
            <Text style={styles.listLabel}>Exclusions:</Text>
            {quote.exclusions.map((item, i) => (
              <View key={`exc-${i}`} style={styles.listItem}>
                <Text style={styles.listBullet}>-</Text>
                <Text style={{ flex: 1 }}>{item}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={{ marginTop: 14 }}>Fee: {formatMoney(quote.fee)}</Text>

        <Text style={{ marginTop: 8 }}>{quote.billingTerms}</Text>

        <Text style={styles.closing}>Please contact me with any questions,</Text>

        <Text style={styles.signature}>
          {company.ownerName} {company.title}
        </Text>

        <FooterBanner />
      </Page>
      <SsiFeeSchedulePages rates={quote.feeSchedule} />
    </Document>
  );
}
