import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
} from "@react-pdf/renderer";
import { billingIssuer } from "@/lib/billing/issuer";
import { brand, statusLabels } from "@/lib/billing/brand";
import { formatClientIdLabel } from "@/lib/billing/clients";
import type { InvoiceDto } from "@/lib/billing/invoices";
import { formatCop } from "@/lib/billing/invoices";

const PAD = 48;
const CONTENT_W = 612 - PAD * 2;

const PILL_FONT_SIZE = 10;
const PILL_HEIGHT = 22;
const PILL_PAD_X = 18;

const LOGO_PATH =
  "M743.71,401.43c3.66-.34,7.36-.51,11.12-.51m-70.52-10.56q-35.12,0-70.21,0c-7.41,0-14.79,0-22.2,0A123.3,123.3,0,0,0,500,445.27a123.27,123.27,0,0,0-91.9-54.91c-7.41,0-14.79,0-22.2,0q-35.08,0-70.21,0t-70.51.12a42.91,42.91,0,0,0,2.09,11.16,42.06,42.06,0,0,0,10.82,17.46A43.14,43.14,0,0,0,286.82,431H397a82.32,82.32,0,1,1-72.85,44c.26-.44.5-.87.72-1.31,0-.05,0-.12.08-.17a20.62,20.62,0,0,0-36-20c-.17.31-.34.6-.5.92l-.66,1.23A123.48,123.48,0,0,0,471.11,612.06l4.24,6L492,641.74a9.62,9.62,0,0,0,15.5,0l16.66-23.66,4.4-6.27A123.48,123.48,0,0,0,712.23,455.7l-.66-1.23c-.17-.32-.34-.61-.51-.92a20.61,20.61,0,0,0-36,20c0,.05.05.12.08.17.21.44.46.87.72,1.31A82.32,82.32,0,1,1,603,431H713.17a43.14,43.14,0,0,0,28.74-11.91,42.06,42.06,0,0,0,10.82-17.46,42.73,42.73,0,0,0,2.08-11.16Q719.55,390.41,684.31,390.36ZM393.74,479.18a34,34,0,1,0,34,34A34,34,0,0,0,393.74,479.18Zm207.87,0a34,34,0,1,0,34,34A34,34,0,0,0,601.61,479.18Z";

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
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginTop: 6,
    marginBottom: 4,
  },
  conceptCell: {
    width: "65%",
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: 10,
    color: brand.foreground,
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
    marginTop: 8,
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
  const radius = Math.max(height / 2, 4);
  return (
    <Svg width={width} height={height}>
      <GradientDefs gradId={gradId} />
      <Rect x={0} y={0} width={width} height={height} rx={radius} fill={`url(#${gradId})`} />
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

function PdfLogoMark({ size = 32, gradId }: { size?: number; gradId: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1000 1000">
      <GradientDefs gradId={gradId} />
      <Path d={LOGO_PATH} fill={`url(#${gradId})`} />
    </Svg>
  );
}

function PdfBrandLogo({ gradId }: { gradId: string }) {
  return (
    <View style={styles.brandRow}>
      <PdfLogoMark size={32} gradId={`${gradId}-mark`} />
      <View style={{ marginLeft: 10 }}>
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
      </View>
    </View>
  );
}

/** Barra con degradado + texto blanco en un solo SVG (react-pdf no superpone bien capas View/Svg). */
function GradientPillBar({
  width,
  gradId,
  leftText,
  rightText,
}: {
  width: number;
  gradId: string;
  leftText: string;
  rightText: string;
}) {
  const textY = PILL_HEIGHT - 7;
  const pillTextStyle = {
    fontFamily: "Montserrat",
    fontSize: PILL_FONT_SIZE,
    fill: "#FFFFFF",
  };

  return (
    <View style={{ width, marginBottom: 6 }}>
      <Svg width={width} height={PILL_HEIGHT}>
        <GradientDefs gradId={gradId} />
        <Rect
          x={0}
          y={0}
          width={width}
          height={PILL_HEIGHT}
          rx={PILL_HEIGHT / 2}
          fill={`url(#${gradId})`}
        />
        <Text x={PILL_PAD_X} y={textY} style={pillTextStyle}>
          {leftText}
        </Text>
        <Text
          x={width - PILL_PAD_X}
          y={textY}
          style={{ ...pillTextStyle, textAnchor: "end" }}
        >
          {rightText}
        </Text>
      </Svg>
    </View>
  );
}

const ROW_HEIGHT = 28;
const BASE_PAGE_HEIGHT = 480;
const FOOTER_BLOCK = 200;
const MAX_PAGE_HEIGHT = 1584;

function estimatePageHeight(itemCount: number): number {
  const content = BASE_PAGE_HEIGHT + itemCount * ROW_HEIGHT + FOOTER_BLOCK;
  return Math.min(MAX_PAGE_HEIGHT, Math.max(792, content));
}

export function InvoicePdfDocument({ invoice }: { invoice: InvoiceDto }) {
  const lineItems = invoice.lineItems;
  const amountFormatted = formatCop(invoice.amount, invoice.currency);
  const statusLabel = statusLabels[invoice.status] ?? invoice.status;
  const uid = invoice.id.slice(-6);
  const totalW = 220;
  const pageHeight = estimatePageHeight(lineItems.length);
  const idLabel = formatClientIdLabel(invoice.clientIdType, invoice.clientId);

  return (
    <Document>
      <Page size={[612, pageHeight]} style={styles.page}>
        <View style={styles.topRow}>
          <PdfBrandLogo gradId={`brand-h-${uid}`} />
        </View>

        <GradientTitle gradId={`title-${uid}`} />

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaText}>
              <Text style={styles.metaBold}>No. </Text>
              {invoice.number}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.metaBold}>Fecha de emisión: </Text>
              {formatDateShort(invoice.issuedAt)}
            </Text>
            <Text style={styles.statusBadge}>Estado: {statusLabel}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaText}>
              <Text style={styles.metaBold}>Empresa: </Text>
              {invoice.clientName}
            </Text>
            {idLabel ? (
              <Text style={styles.metaText}>
                <Text style={styles.metaBold}>Identificación: </Text>
                {idLabel}
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

        <GradientPillBar
          width={CONTENT_W}
          gradId={`hdr-${uid}`}
          leftText="Concepto"
          rightText="Valor"
        />

        {lineItems.map((item) => (
          <View key={item.id} style={styles.tableRow} wrap={false}>
            <Text style={styles.conceptCell}>{item.concept}</Text>
            <Text style={styles.valueCell}>
              {formatCop(item.amount, invoice.currency)}
            </Text>
          </View>
        ))}

        <GradientRule gradId={`rule1-${uid}`} />

        <View style={styles.totalWrap}>
          <GradientPillBar
            width={totalW}
            gradId={`tot-${uid}`}
            leftText="Total"
            rightText={amountFormatted}
          />
        </View>

        <GradientRule gradId={`rule2-${uid}`} />

        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.sectionTitle}>Información de pago</Text>
            <Text style={styles.bodyText}>
              {invoice.paymentInstructions}
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
