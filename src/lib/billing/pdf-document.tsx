import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from "@react-pdf/renderer";
import path from "path";
import { billingIssuer } from "@/lib/billing/issuer";
import { brand, statusLabels } from "@/lib/billing/brand";
import type { InvoiceDto } from "@/lib/billing/invoices";
import { formatCop } from "@/lib/billing/invoices";

const logoFullPath = path.join(process.cwd(), "public", "THEPIOLO-05.svg");
const logoMarkPath = path.join(process.cwd(), "public", "THEPIOLO-ONLYLOGO-05.svg");
const CONTENT_W = 515;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 56,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: brand.foreground,
    backgroundColor: brand.background,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  logoFull: {
    width: 220,
    height: 52,
    objectFit: "contain",
    objectPosition: "left",
  },
  logoMark: {
    width: 36,
    height: 36,
    objectFit: "contain",
    marginBottom: 8,
  },
  headerLogos: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoMarkHeader: {
    width: 40,
    height: 40,
    objectFit: "contain",
    marginLeft: 12,
  },
  decorDots: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 30,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: brand.accentMid,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  metaCol: {
    width: "48%",
  },
  metaText: {
    fontSize: 10,
    color: brand.foregroundSubtle,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  metaBold: {
    fontFamily: "Helvetica-Bold",
    color: brand.foreground,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 2,
    borderRadius: 24,
    overflow: "hidden",
  },
  tableHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: brand.border,
  },
  conceptCell: {
    width: "68%",
    fontSize: 10,
    color: brand.foregroundSubtle,
    lineHeight: 1.5,
    paddingRight: 16,
  },
  valueCell: {
    width: "28%",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: brand.foreground,
    textAlign: "right",
  },
  totalWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    marginBottom: 28,
  },
  totalPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 24,
    minWidth: 180,
    justifyContent: "space-between",
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#FFFFFF",
    marginRight: 16,
  },
  totalAmount: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: brand.border,
  },
  footerCol: {
    width: "58%",
  },
  footerColRight: {
    width: "38%",
    alignItems: "flex-end",
  },
  footerLogoWrap: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: brand.foreground,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 9,
    color: brand.foregroundSubtle,
    lineHeight: 1.55,
    marginBottom: 4,
  },
  contactLine: {
    fontSize: 9,
    color: brand.muted,
    marginBottom: 4,
    textAlign: "right",
  },
  statusBadge: {
    marginTop: 4,
    fontSize: 8,
    color: brand.muted,
  },
});

function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

function GradientBar({
  width = CONTENT_W,
  height = 40,
  id = "brandGrad",
}: {
  width?: number;
  height?: number;
  id?: string;
}) {
  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={brand.accentStart} />
          <Stop offset="50%" stopColor={brand.accentMid} />
          <Stop offset="100%" stopColor={brand.accentEnd} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#${id})`} />
    </Svg>
  );
}

function DecorGrid() {
  const colors = [brand.accentStart, brand.accentMid, brand.accentEnd];
  const dots = [];
  for (let i = 0; i < 9; i++) {
    dots.push(
      <View
        key={i}
        style={[styles.dot, { backgroundColor: colors[i % 3] }]}
      />,
    );
  }
  return <View style={styles.decorDots}>{dots}</View>;
}

function TableHeaderPill() {
  return (
    <View style={{ position: "relative", marginBottom: 2 }}>
      <View style={{ height: 40, borderRadius: 24, overflow: "hidden" }}>
        <GradientBar width={CONTENT_W} height={40} id="headerGrad" />
      </View>
      <View
        style={[
          styles.tableHeader,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "transparent",
          },
        ]}
      >
        <Text style={styles.tableHeaderText}>Concepto</Text>
        <Text style={styles.tableHeaderText}>Valor</Text>
      </View>
    </View>
  );
}

function TotalPill({ amount }: { amount: string }) {
  const pillW = 220;
  return (
    <View style={{ position: "relative" }}>
      <View style={{ height: 44, borderRadius: 24, overflow: "hidden", width: pillW }}>
        <GradientBar width={pillW} height={44} id="totalGrad" />
      </View>
      <View
        style={[
          styles.totalPill,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "transparent",
          },
        ]}
      >
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{amount}</Text>
      </View>
    </View>
  );
}

export function InvoicePdfDocument({ invoice }: { invoice: InvoiceDto }) {
  const amountFormatted = formatCop(invoice.amount, invoice.currency);
  const statusLabel = statusLabels[invoice.status] ?? invoice.status;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.topRow}>
          <View style={styles.headerLogos}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF Image */}
            <Image src={logoFullPath} style={styles.logoFull} />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF Image */}
            <Image src={logoMarkPath} style={styles.logoMarkHeader} />
          </View>
          <DecorGrid />
        </View>

        <Text style={styles.title}>Cuenta de cobro</Text>

        {/* Nº / Fecha | Cliente / NIT */}
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaText}>
              <Text style={styles.metaBold}>No. </Text>
              {invoice.number}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.metaBold}>Fecha: </Text>
              {formatDateShort(invoice.issuedAt)}
            </Text>
            {invoice.dueAt ? (
              <Text style={styles.metaText}>
                <Text style={styles.metaBold}>Vence: </Text>
                {formatDateShort(invoice.dueAt)}
              </Text>
            ) : null}
            <Text style={styles.statusBadge}>Estado: {statusLabel}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaText}>
              <Text style={styles.metaBold}>Empresa: </Text>
              {invoice.clientName}
            </Text>
            {invoice.clientId ? (
              <Text style={styles.metaText}>
                <Text style={styles.metaBold}>NIT / CC: </Text>
                {invoice.clientId}
              </Text>
            ) : null}
            {invoice.clientEmail ? (
              <Text style={styles.metaText}>
                <Text style={styles.metaBold}>Correo: </Text>
                {invoice.clientEmail}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Tabla concepto / valor */}
        <TableHeaderPill />
        <View style={styles.tableRow}>
          <Text style={styles.conceptCell}>{invoice.concept}</Text>
          <Text style={styles.valueCell}>{amountFormatted}</Text>
        </View>

        <View style={styles.totalWrap}>
          <TotalPill amount={amountFormatted} />
        </View>

        {/* Footer: pago + contacto */}
        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.sectionTitle}>Información de pago</Text>
            <Text style={styles.bodyText}>
              {invoice.paymentInstructions || billingIssuer.defaultPaymentInstructions}
            </Text>
            {invoice.notes ? (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Notas</Text>
                <Text style={styles.bodyText}>{invoice.notes}</Text>
              </>
            ) : null}
          </View>
          <View style={styles.footerColRight}>
            <View style={styles.footerLogoWrap}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF Image */}
              <Image src={logoMarkPath} style={styles.logoMark} />
              {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF Image */}
              <Image src={logoFullPath} style={{ width: 120, height: 28, objectFit: "contain" }} />
            </View>
            <Text style={[styles.sectionTitle, { textAlign: "right" }]}>
              {billingIssuer.name}
            </Text>
            <Text style={styles.contactLine}>{billingIssuer.email}</Text>
            <Text style={styles.contactLine}>{billingIssuer.phone}</Text>
            <Text style={styles.contactLine}>{billingIssuer.instagram}</Text>
            <Text style={styles.contactLine}>{billingIssuer.website}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
