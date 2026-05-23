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

const logoMarkPath = path.join(process.cwd(), "public", "THEPIOLO-ONLYLOGO-05.svg");

const PAGE_W = 595.28;
const PAD = 40;
const CONTENT_W = PAGE_W - PAD * 2;

const styles = StyleSheet.create({
  page: {
    padding: PAD,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: brand.foreground,
    backgroundColor: brand.background,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoMark: {
    width: 44,
    height: 44,
    objectFit: "contain",
  },
  brandName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: brand.accentMid,
    marginLeft: 10,
  },
  brandSub: {
    fontSize: 8,
    color: brand.muted,
    marginLeft: 10,
    marginTop: 2,
    letterSpacing: 0.8,
  },
  decorDots: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 30,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaCol: {
    width: "48%",
  },
  metaText: {
    fontSize: 10,
    color: brand.foregroundSubtle,
    marginBottom: 5,
    lineHeight: 1.45,
  },
  metaBold: {
    fontFamily: "Helvetica-Bold",
    color: brand.foreground,
  },
  pillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  pillText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 36,
  },
  conceptCell: {
    width: "65%",
    fontSize: 10,
    color: brand.foregroundSubtle,
    lineHeight: 1.5,
    paddingRight: 12,
  },
  valueCell: {
    width: "30%",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: brand.foreground,
    textAlign: "right",
  },
  totalWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  footerCol: {
    width: "58%",
  },
  footerColRight: {
    width: "38%",
    alignItems: "flex-end",
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: brand.foreground,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 9,
    color: brand.foregroundSubtle,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  contactLine: {
    fontSize: 9,
    color: brand.muted,
    marginBottom: 3,
    textAlign: "right",
  },
  statusBadge: {
    fontSize: 8,
    color: brand.muted,
    marginTop: 2,
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
  width,
  height,
  gradId,
}: {
  width: number;
  height: number;
  gradId: string;
}) {
  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={brand.accentStart} />
          <Stop offset="50%" stopColor={brand.accentMid} />
          <Stop offset="100%" stopColor={brand.accentEnd} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} rx={height / 2} fill={`url(#${gradId})`} />
    </Svg>
  );
}

function GradientRule({ gradId }: { gradId: string }) {
  return (
    <View style={{ marginVertical: 10 }}>
      <GradientBar width={CONTENT_W} height={2} gradId={gradId} />
    </View>
  );
}

/** Título con degradado vía SVG */
function GradientTitle({ gradId }: { gradId: string }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Svg width={280} height={36} viewBox="0 0 280 36">
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={brand.accentStart} />
            <Stop offset="50%" stopColor={brand.accentMid} />
            <Stop offset="100%" stopColor={brand.accentEnd} />
          </LinearGradient>
        </Defs>
        <Text
          x={0}
          y={28}
          style={{
            fontSize: 26,
            fontFamily: "Helvetica-Bold",
            fill: `url(#${gradId})`,
          }}
        >
          Cuenta de cobro
        </Text>
      </Svg>
    </View>
  );
}

function GradientPill({
  width,
  height,
  gradId,
  children,
}: {
  width: number;
  height: number;
  gradId: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: height / 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <View style={{ position: "absolute", top: 0, left: 0 }}>
        <GradientBar width={width} height={height} gradId={gradId} />
      </View>
      <View
        style={[
          styles.pillRow,
          {
            height,
            width,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function DecorGrid() {
  const colors = [brand.accentStart, brand.accentMid, brand.accentEnd];
  return (
    <View style={styles.decorDots}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, { backgroundColor: colors[i % 3] }]}
        />
      ))}
    </View>
  );
}

function estimatePageHeight(invoice: InvoiceDto): number {
  const conceptLines = Math.max(1, Math.ceil(invoice.concept.length / 72));
  const payment =
    invoice.paymentInstructions || billingIssuer.defaultPaymentInstructions;
  const paymentLines = Math.ceil(payment.length / 58);
  const notesLines = invoice.notes ? Math.ceil(invoice.notes.length / 58) : 0;

  let h = 400;
  h += (conceptLines - 1) * 16;
  h += paymentLines * 10;
  h += notesLines * 10;

  return Math.min(842, Math.max(380, h));
}

export function InvoicePdfDocument({ invoice }: { invoice: InvoiceDto }) {
  const amountFormatted = formatCop(invoice.amount, invoice.currency);
  const statusLabel = statusLabels[invoice.status] ?? invoice.status;
  const pageHeight = estimatePageHeight(invoice);
  const uid = invoice.id.slice(-6);

  const headerH = 44;
  const totalW = 200;
  const totalH = 40;

  return (
    <Document>
      <Page size={[PAGE_W, pageHeight]} style={styles.page}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF */}
            <Image src={logoMarkPath} style={styles.logoMark} />
            <View>
              <Text style={styles.brandName}>THEPIOLO</Text>
              <Text style={styles.brandSub}>GRAPHIC DESIGN</Text>
            </View>
          </View>
          <DecorGrid />
        </View>

        <GradientTitle gradId={`title-${uid}`} />

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

        <GradientPill width={CONTENT_W} height={headerH} gradId={`hdr-${uid}`}>
          <Text style={styles.pillText}>Concepto</Text>
          <Text style={styles.pillText}>Valor</Text>
        </GradientPill>

        <View style={styles.tableRow}>
          <Text style={styles.conceptCell}>{invoice.concept}</Text>
          <Text style={styles.valueCell}>{amountFormatted}</Text>
        </View>

        <GradientRule gradId={`rule1-${uid}`} />

        <View style={styles.totalWrap}>
          <GradientPill width={totalW} height={totalH} gradId={`tot-${uid}`}>
            <Text style={styles.pillText}>Total</Text>
            <Text style={styles.pillText}>{amountFormatted}</Text>
          </GradientPill>
        </View>

        <GradientRule gradId={`rule2-${uid}`} />

        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.sectionTitle}>Información de pago</Text>
            <Text style={styles.bodyText}>
              {invoice.paymentInstructions || billingIssuer.defaultPaymentInstructions}
            </Text>
            {invoice.notes ? (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Notas</Text>
                <Text style={styles.bodyText}>{invoice.notes}</Text>
              </>
            ) : null}
          </View>
          <View style={styles.footerColRight}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF */}
            <Image src={logoMarkPath} style={{ width: 32, height: 32, marginBottom: 6 }} />
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
