import { Fragment } from "react";
import { Page, StyleSheet, View, Text } from "@react-pdf/renderer";
import { Header, colors, styles } from "./shared";

export type MatrixRow = {
  type: string;
  minHours: number;
  maxHours: number;
};

export const TYPICAL_SSI_ROWS: MatrixRow[] = [
  { type: "Epoxy Anchors (1-20 Anchors)", minHours: 1, maxHours: 1 },
  { type: "Holdowns & Anchor Bolts", minHours: 1, maxHours: 1 },
  { type: "Light Gauge Framing Connections", minHours: 1, maxHours: 1 },
  { type: "Roof Equipment Supports", minHours: 1, maxHours: 1 },
  { type: "Mechanical Unit Anchorage", minHours: 1, maxHours: 1 },
  { type: "Miscellaneous Steel Connections", minHours: 1, maxHours: 1 },
  { type: "Pipe Support Assemblies", minHours: 1, maxHours: 2 },
  { type: "Structural Steel Field Welding", minHours: 2, maxHours: 2 },
  { type: "Structural Steel Bolting", minHours: 2, maxHours: 2 },
  { type: "Roof Screen Supports", minHours: 2, maxHours: 2 },
  { type: "Elevated Equipment Platforms", minHours: 2, maxHours: 3 },
  { type: "Solar Support Structures", minHours: 2, maxHours: 3 },
  { type: "Existing Structure Modifications", minHours: 2, maxHours: 4 },
  { type: "Transfer Beam Installation", minHours: 3, maxHours: 4 },
  { type: "Large Steel Moment Connections", minHours: 3, maxHours: 4 },
  { type: "Industrial Pipe Racks", minHours: 4, maxHours: 6 },
  { type: "Data Center Equipment Support Systems", minHours: 4, maxHours: 6 },
];

export const CONCRETE_ROWS: MatrixRow[] = [
  { type: "Footing Reinforcing Steel", minHours: 1, maxHours: 1 },
  { type: "Foundation Reinforcing Steel", minHours: 1, maxHours: 1 },
  { type: "Grade Beam Reinforcing", minHours: 1, maxHours: 2 },
  { type: "Slab Reinforcing & PT Layout Verification", minHours: 1, maxHours: 2 },
  { type: "Concrete Wall Reinforcing", minHours: 1, maxHours: 2 },
  { type: "Masonry Grout & Reinforcing Verification", minHours: 1, maxHours: 2 },
  { type: "Structural Concrete Embed Inspection", minHours: 1, maxHours: 1 },
  { type: "Cast-in-Place Anchor Rods", minHours: 1, maxHours: 1 },
  { type: "Post-Installed Anchors (Epoxy/Mechanical)", minHours: 1, maxHours: 1 },
  { type: "Elevated Slab Reinforcing", minHours: 2, maxHours: 3 },
  { type: "Concrete Repair Verification", minHours: 2, maxHours: 3 },
  { type: "Existing Concrete Structural Modification", minHours: 2, maxHours: 4 },
];

export function formatDollar(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function formatHours(min: number, max: number): string {
  if (min === max) {
    return min === 1 ? "1 hr" : `${min} hrs`;
  }
  return `${min}-${max} hrs`;
}

export function formatFeeRange(
  min: number,
  max: number,
  base: number,
  perHour: number
): string {
  const lo = base + (min - 1) * perHour;
  const hi = base + (max - 1) * perHour;
  if (min === max) {
    return formatDollar(lo);
  }
  return `${formatDollar(lo)}-${formatDollar(hi)}`;
}

export function formatTotalRange(
  min: number,
  max: number,
  base: number,
  perHour: number,
  report: number
): string {
  const lo = base + (min - 1) * perHour + report;
  const hi = base + (max - 1) * perHour + report;
  if (min === max) {
    return formatDollar(lo);
  }
  return `${formatDollar(lo)}-${formatDollar(hi)}`;
}

const localStyles = StyleSheet.create({
  pageTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  // Two-column service/fee tables (Page A)
  twoColTable: {
    marginBottom: 8,
  },
  twoColHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.black,
    paddingVertical: 5,
  },
  twoColRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    paddingVertical: 5,
  },
  twoColService: { width: "70%", paddingHorizontal: 4 },
  twoColFee: { width: "30%", paddingHorizontal: 4, textAlign: "right" },
  // Five-column matrix tables (Pages B & C)
  matrixTable: {
    marginBottom: 8,
  },
  matrixHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.black,
    paddingVertical: 5,
  },
  matrixRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    paddingVertical: 5,
  },
  cellType: { width: "36%", paddingHorizontal: 4 },
  cellTime: { width: "16%", paddingHorizontal: 4, textAlign: "left" },
  cellFee: { width: "16%", paddingHorizontal: 4, textAlign: "right" },
  cellReport: { width: "14%", paddingHorizontal: 4, textAlign: "right" },
  cellTotal: { width: "18%", paddingHorizontal: 4, textAlign: "right" },
  headerCell: { fontFamily: "Helvetica-Bold" },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 12,
  },
  bulletText: {
    flex: 1,
  },
});

type Rates = {
  siteVisitRate: number;
  additionalHourlyRate: number;
  reportRate: number;
};

function PageA({ rates }: { rates: Rates }) {
  const { siteVisitRate, additionalHourlyRate, reportRate } = rates;

  const serviceRows: { service: string; fee: string }[] = [
    {
      service: "SSI Site Visit (Includes up to 1 Hour On-Site)",
      fee: formatDollar(siteVisitRate),
    },
    {
      service: "Additional On-Site Time",
      fee: `${formatDollar(additionalHourlyRate)} per Hour`,
    },
    {
      service: "Final Sealed SSI Report",
      fee: formatDollar(reportRate),
    },
  ];

  const typicalRows: { scope: string; fee: string }[] = [
    {
      scope: "One Site Visit + Final Sealed Report",
      fee: formatDollar(siteVisitRate + reportRate),
    },
    {
      scope: "Two Site Visits + Final Sealed Report",
      fee: formatDollar(2 * siteVisitRate + reportRate),
    },
    {
      scope: "Three Site Visits + Final Sealed Report",
      fee: formatDollar(3 * siteVisitRate + reportRate),
    },
  ];

  const notes: string[] = [
    "Site visit fee includes up to one (1) hour on-site.",
    `Additional time beyond the first hour will be billed at ${formatDollar(additionalHourlyRate)} per hour.`,
    "Final sealed SSI report includes review of inspection documentation and preparation of the signed and sealed report.",
    "Fees are per inspected item/system unless otherwise agreed upon in writing.",
    "Travel outside the Phoenix metropolitan area may be subject to additional charges.",
  ];

  return (
    <Page size="LETTER" style={styles.page}>
      <Header />
      <Text style={localStyles.pageTitle}>
        Special Structural Inspection (SSI) Fee Schedule
      </Text>

      <View style={localStyles.twoColTable}>
        <View style={localStyles.twoColHeaderRow}>
          <Text style={[localStyles.twoColService, localStyles.headerCell]}>
            Service
          </Text>
          <Text style={[localStyles.twoColFee, localStyles.headerCell]}>
            Fee
          </Text>
        </View>
        {serviceRows.map((row, i) => (
          <View key={`svc-${i}`} style={localStyles.twoColRow}>
            <Text style={localStyles.twoColService}>{row.service}</Text>
            <Text style={localStyles.twoColFee}>{row.fee}</Text>
          </View>
        ))}
      </View>

      <Text style={localStyles.sectionHeading}>Typical Inspection Costs</Text>

      <View style={localStyles.twoColTable}>
        <View style={localStyles.twoColHeaderRow}>
          <Text style={[localStyles.twoColService, localStyles.headerCell]}>
            Scope
          </Text>
          <Text style={[localStyles.twoColFee, localStyles.headerCell]}>
            Fee
          </Text>
        </View>
        {typicalRows.map((row, i) => (
          <View key={`typ-${i}`} style={localStyles.twoColRow}>
            <Text style={localStyles.twoColService}>{row.scope}</Text>
            <Text style={localStyles.twoColFee}>{row.fee}</Text>
          </View>
        ))}
      </View>

      <Text style={localStyles.sectionHeading}>Notes</Text>
      {notes.map((note, i) => (
        <View key={`note-${i}`} style={localStyles.bulletRow}>
          <Text style={localStyles.bulletDot}>-</Text>
          <Text style={localStyles.bulletText}>{note}</Text>
        </View>
      ))}
    </Page>
  );
}

function MatrixPage({
  title,
  rows,
  rates,
}: {
  title: string;
  rows: MatrixRow[];
  rates: Rates;
}) {
  const { siteVisitRate, additionalHourlyRate, reportRate } = rates;
  return (
    <Page size="LETTER" style={styles.page}>
      <Header />
      <Text style={localStyles.pageTitle}>{title}</Text>

      <View style={localStyles.matrixTable}>
        <View style={localStyles.matrixHeaderRow}>
          <Text style={[localStyles.cellType, localStyles.headerCell]}>
            Inspection Type
          </Text>
          <Text style={[localStyles.cellTime, localStyles.headerCell]}>
            Typical Field Time
          </Text>
          <Text style={[localStyles.cellFee, localStyles.headerCell]}>
            Inspection Fee
          </Text>
          <Text style={[localStyles.cellReport, localStyles.headerCell]}>
            Sealed Report
          </Text>
          <Text style={[localStyles.cellTotal, localStyles.headerCell]}>
            Total Fee
          </Text>
        </View>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={localStyles.matrixRow}>
            <Text style={localStyles.cellType}>{row.type}</Text>
            <Text style={localStyles.cellTime}>
              {formatHours(row.minHours, row.maxHours)}
            </Text>
            <Text style={localStyles.cellFee}>
              {formatFeeRange(
                row.minHours,
                row.maxHours,
                siteVisitRate,
                additionalHourlyRate
              )}
            </Text>
            <Text style={localStyles.cellReport}>
              {formatDollar(reportRate)}
            </Text>
            <Text style={localStyles.cellTotal}>
              {formatTotalRange(
                row.minHours,
                row.maxHours,
                siteVisitRate,
                additionalHourlyRate,
                reportRate
              )}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  );
}

export function SsiFeeSchedulePages({
  rates,
  includeTypicalMatrix,
  includeConcreteMatrix,
}: {
  rates: Rates;
  includeTypicalMatrix: boolean;
  includeConcreteMatrix: boolean;
}) {
  return (
    <Fragment>
      <PageA rates={rates} />
      {includeTypicalMatrix && (
        <MatrixPage
          title="JRW Engineering – Typical SSI Pricing Matrix"
          rows={TYPICAL_SSI_ROWS}
          rates={rates}
        />
      )}
      {includeConcreteMatrix && (
        <MatrixPage
          title="Concrete Construction SSI"
          rows={CONCRETE_ROWS}
          rates={rates}
        />
      )}
    </Fragment>
  );
}
