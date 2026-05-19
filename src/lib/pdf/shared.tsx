import { StyleSheet, View, Text } from "@react-pdf/renderer";

export const colors = {
  black: "#000000",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#cbd5e1",
  banner: "#d6d3d1",
  bannerLight: "#e7e5e4",
  tan: "#e8e1cd",
  link: "#1d4ed8",
};

export const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 60,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: colors.text,
    lineHeight: 1.35,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.black,
  },
  headerLineShort: {
    width: 40,
    height: 1,
    backgroundColor: colors.black,
  },
  headerTitle: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 22,
    marginHorizontal: 10,
  },
  companyBlock: {
    marginBottom: 24,
  },
  companyName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 2,
  },
  companyLine: {
    marginLeft: 12,
  },
  email: {
    color: colors.link,
    marginLeft: 12,
    textDecoration: "underline",
  },
  date: {
    marginBottom: 14,
  },
  recipient: {
    marginBottom: 16,
  },
  recipientLine: {
    marginBottom: 0,
  },
  infoTable: {
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: colors.black,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.black,
  },
  infoLabel: {
    width: 130,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontFamily: "Helvetica-BoldOblique",
    backgroundColor: "transparent",
  },
  infoLabelTan: {
    width: 130,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontFamily: "Helvetica-BoldOblique",
    backgroundColor: colors.tan,
  },
  infoValue: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderLeftWidth: 0.5,
    borderColor: colors.black,
  },
  infoValueTan: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderLeftWidth: 0.5,
    borderColor: colors.black,
    backgroundColor: colors.tan,
    fontFamily: "Helvetica-Bold",
  },
  sectionBanner: {
    backgroundColor: colors.bannerLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 14,
  },
  sectionBannerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  listLabel: {
    marginBottom: 4,
    marginTop: 8,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 1,
    paddingLeft: 8,
  },
  listBullet: {
    width: 12,
  },
  closing: {
    marginTop: 20,
  },
  signature: {
    marginTop: 18,
    fontFamily: "Helvetica-Bold",
  },
  footerBanner: {
    backgroundColor: colors.bannerLight,
    height: 14,
    marginTop: 12,
  },
});

export function Header() {
  return (
    <View style={styles.headerRow} fixed>
      <View style={styles.headerLineShort} />
      <Text style={styles.headerTitle}>JRW Engineering</Text>
      <View style={styles.headerLine} />
    </View>
  );
}

export function CompanyBlock({
  ownerName,
  title,
  address,
  city,
  state,
  zip,
  phone,
  email,
}: {
  ownerName: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}) {
  return (
    <View style={styles.companyBlock}>
      <Text style={styles.companyName}>
        {ownerName} {title}
      </Text>
      <Text style={styles.companyLine}>{address}</Text>
      <Text style={styles.companyLine}>
        {city} {state} {zip}
      </Text>
      <Text style={styles.companyLine}>c:{phone}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}

export function InfoRow({
  label,
  value,
  tan = false,
}: {
  label: string;
  value: string;
  tan?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={tan ? styles.infoLabelTan : styles.infoLabel}>{label}</Text>
      <Text style={tan ? styles.infoValueTan : styles.infoValue}>{value}</Text>
    </View>
  );
}

export function SectionBanner({ text }: { text: string }) {
  return (
    <View style={styles.sectionBanner}>
      <Text style={styles.sectionBannerText}>{text}</Text>
    </View>
  );
}

export function FooterBanner() {
  return <View style={styles.footerBanner} />;
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatMoney(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
