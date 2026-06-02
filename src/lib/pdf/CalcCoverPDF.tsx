import {
  Document,
  Image,
  Page,
  StyleSheet,
  View,
  Text,
} from "@react-pdf/renderer";
import { colors, formatDateShort, styles } from "./shared";

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

type CoverData = {
  projectName: string;
  date: Date;
  recipient: {
    name: string;
    firstName: string;
    company: string | null;
  };
};

const coverStyles = StyleSheet.create({
  headerBlock: {
    alignItems: "flex-end",
    marginBottom: 36,
  },
  headerLine: {
    fontSize: 11,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  metaLabel: {
    width: 60,
  },
  metaValue: {
    flex: 1,
  },
  rule: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  commentsLabel: {
    marginBottom: 8,
  },
  body: {
    paddingLeft: 30,
  },
  bodyParagraph: {
    marginBottom: 10,
  },
  signatureImage: {
    marginTop: 8,
    marginBottom: -4,
    width: 200,
    height: 60,
    objectFit: "contain",
  },
  signature: {
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
  },
});

export function CalcCoverPDF({
  company,
  cover,
  signatureImage,
}: {
  company: Company;
  cover: CoverData;
  signatureImage?: Buffer;
}) {
  const toValue = cover.recipient.company
    ? `${cover.recipient.name} - ${cover.recipient.company}`
    : cover.recipient.name;
  const fromValue = `${company.ownerName} ${company.title}`.trim();
  const signatureValue = fromValue;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={coverStyles.headerBlock}>
          <Text style={coverStyles.headerLine}>{company.companyName}</Text>
          <Text style={coverStyles.headerLine}>
            {`${company.city} ${company.state}`.trim()}
          </Text>
        </View>

        <View style={coverStyles.metaRow}>
          <Text style={coverStyles.metaLabel}>To:</Text>
          <Text style={coverStyles.metaValue}>{toValue}</Text>
        </View>
        <View style={coverStyles.metaRow}>
          <Text style={coverStyles.metaLabel}>From:</Text>
          <Text style={coverStyles.metaValue}>{fromValue}</Text>
        </View>
        <View style={coverStyles.metaRow}>
          <Text style={coverStyles.metaLabel}>Date:</Text>
          <Text style={coverStyles.metaValue}>{formatDateShort(cover.date)}</Text>
        </View>
        <View style={coverStyles.metaRow}>
          <Text style={coverStyles.metaLabel}>Re:</Text>
          <Text style={coverStyles.metaValue}>{cover.projectName}</Text>
        </View>

        <View style={coverStyles.rule} />

        <Text style={coverStyles.commentsLabel}>Comments:</Text>

        <View style={coverStyles.body}>
          <Text style={coverStyles.bodyParagraph}>
            {cover.recipient.firstName},
          </Text>
          <Text style={coverStyles.bodyParagraph}>
            Please see the attached calculations for {cover.projectName}.
          </Text>
          <Text style={coverStyles.bodyParagraph}>
            If you have any other questions, please feel free to give me a call
            at {company.phone}
          </Text>
          <Text style={coverStyles.bodyParagraph}>Sincerely,</Text>
          {signatureImage && (
            <Image src={signatureImage} style={coverStyles.signatureImage} />
          )}
          <Text style={coverStyles.signature}>{signatureValue}</Text>
        </View>

        <View style={coverStyles.rule} />
      </Page>
    </Document>
  );
}
