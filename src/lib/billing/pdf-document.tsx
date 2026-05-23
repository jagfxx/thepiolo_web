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

const PAD = 48;
const CONTENT_W = 612 - PAD * 2;

const PILL_FONT_SIZE = 10;
const PILL_PAD_V = 2;
const PILL_HEIGHT = PILL_FONT_SIZE + PILL_PAD_V * 2;

const styles = StyleSheet.create({
  page: {
    padding: PAD,
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 10,
    color: brand.foreground,
    backgroundColor: brand.background,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoMark: {
    width: 32,
    height: 32,
    objectFit: "contain",
  },
  brandSubtitle: {
    fontFamily: "Montserrat",
    fontSize: 7,
    color: brand.muted,
    marginTop: 3,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  metaCol: {
    width: "48%",
  },
  metaText: {
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 10,
    color: brand.foregroundSubtle,
    marginBottom: 5,
    lineHeight: 1.45,
  },
  metaBold: {
    fontFamily: "Montserrat",
    fontWeight: 600,
    color: brand.foreground,
  },
  pillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: PILL_PAD_V,
  },
  pillText: {
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: PILL_FONT_SIZE,
    color: "#FFFFFF",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 32,
  },
  conceptCell: {
    width: "65%",
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 10,
    color: brand.foregroundSubtle,
    lineHeight: 1.5,
    paddingRight: 12,
  },
  valueCell: {
    width: "30%",
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: 10,
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
    marginTop: 8,
  },
  footerCol: {
    width: "58%",
  },
  footerColRight: {
    width: "38%",
    alignItems: "flex-end",
  },
  sectionTitle: {
    fontFamily: "Montserrat",
    fontWeight: 600,
    fontSize: 10,
    color: brand.foreground,
    marginBottom: 6,
  },
  bodyText: {
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 9,
    color: brand.foregroundSubtle,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  contactLine: {
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 9,
    color: brand.muted,
    marginBottom: 3,
    textAlign: "right",
  },
  statusBadge: {
    fontFamily: "Montserrat",
    fontWeight: 400,
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

function GradientDefs({ gradId }: { gradId: string }) {
  return (
    <Defs>
      <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0%" stopColor={brand.accentStart} />
        <Stop offset="50%" stopColor={brand.accentMid} />
        <Stop offset="100%" stopColor={brand.accentEnd} />
      </LinearGradient>
    </Defs>
  );
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
      <GradientDefs gradId={gradId} />
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

/** Título Montserrat regular con degradado */
function GradientTitle({ gradId }: { gradId: string }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Svg width={300} height={34} viewBox="0 0 300 34">
        <GradientDefs gradId={gradId} />
        <Text
          x={0}
          y={26}
          style={{
            fontSize: 24,
            fontFamily: "Montserrat",
            fontWeight: 400,
            fill: `url(#${gradId})`,
          }}
        >
          Cuenta de cobro
        </Text>
      </Svg>
    </View>
  );
}

/** Logo como en admin: ícono + THEPIOLO en Syne con degradado */
function PdfBrandLogo({
  gradId,
  subtitle,
}: {
  gradId: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.brandRow}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF */}
      <Image src={logoMarkPath} style={styles.logoMark} />
      <View>
        <Svg width={120} height={18} viewBox="0 0 120 18">
          <GradientDefs gradId={gradId} />
          <Text
            x={0}
            y={14}
            style={{
              fontSize: 13,
              fontFamily: "Syne",
              fontWeight: 600,
              fill: `url(#${gradId})`,
            }}
          >
            THEPIOLO
          </Text>
        </Svg>
        {subtitle ? <Text style={styles.brandSubtitle}>{subtitle}</Text> : null}
      </View>
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
      <View style={[styles.pillRow, { height, width }]}>{children}</View>
    </View>
  );
}

export function InvoicePdfDocument({ invoice }: { invoice: InvoiceDto }) {
  const amountFormatted = formatCop(invoice.amount, invoice.currency);
  const statusLabel = statusLabels[invoice.status] ?? invoice.status;
  const uid = invoice.id.slice(-6);

  const totalW = 200;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.topRow}>
          <PdfBrandLogo gradId={`brand-h-${uid}`} subtitle="Graphic Design" />
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

        <GradientPill width={CONTENT_W} height={PILL_HEIGHT} gradId={`hdr-${uid}`}>
          <Text style={styles.pillText}>Concepto</Text>
          <Text style={styles.pillText}>Valor</Text>
        </GradientPill>

        <View style={styles.tableRow}>
          <Text style={styles.conceptCell}>{invoice.concept}</Text>
          <Text style={styles.valueCell}>{amountFormatted}</Text>
        </View>

        <GradientRule gradId={`rule1-${uid}`} />

        <View style={styles.totalWrap}>
          <GradientPill width={totalW} height={PILL_HEIGHT} gradId={`tot-${uid}`}>
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
                marginBottom: 8,
              }}
            >
              <PdfBrandLogo gradId={`brand-f-${uid}`} />
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
