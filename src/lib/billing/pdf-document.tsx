import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { billingIssuer } from "@/lib/billing/issuer";
import type { InvoiceDto } from "@/lib/billing/invoices";
import { formatCop } from "@/lib/billing/invoices";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a28",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#b440ff",
  },
  brand: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#b440ff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#8b8b9e",
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    color: "#13131e",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#8b8b9e",
    width: "35%",
  },
  value: {
    width: "65%",
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#8b8b9e",
    marginBottom: 8,
  },
  concept: {
    lineHeight: 1.5,
    marginBottom: 20,
  },
  amountBox: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#f4f0fa",
    borderRadius: 8,
  },
  amount: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#b440ff",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#8b8b9e",
    borderTopWidth: 1,
    borderTopColor: "#e8e8ef",
    paddingTop: 12,
  },
});

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
  }).format(new Date(iso));
}

export function InvoicePdfDocument({ invoice }: { invoice: InvoiceDto }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>{billingIssuer.brand}</Text>
          <Text style={styles.subtitle}>{billingIssuer.name}</Text>
          <Text style={styles.subtitle}>
            {billingIssuer.email} · {billingIssuer.phone}
          </Text>
        </View>

        <Text style={styles.title}>CUENTA DE COBRO</Text>
        <Text style={styles.subtitle}>No. {invoice.number}</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de emisión</Text>
            <Text style={styles.value}>{formatDate(invoice.issuedAt)}</Text>
          </View>
          {invoice.dueAt && (
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de vencimiento</Text>
              <Text style={styles.value}>{formatDate(invoice.dueAt)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Estado</Text>
            <Text style={styles.value}>{invoice.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{invoice.clientName}</Text>
          </View>
          {invoice.clientId && (
            <View style={styles.row}>
              <Text style={styles.label}>Identificación</Text>
              <Text style={styles.value}>{invoice.clientId}</Text>
            </View>
          )}
          {invoice.clientEmail && (
            <View style={styles.row}>
              <Text style={styles.label}>Correo</Text>
              <Text style={styles.value}>{invoice.clientEmail}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Concepto</Text>
          <Text style={styles.concept}>{invoice.concept}</Text>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.sectionTitle}>Valor a pagar</Text>
          <Text style={styles.amount}>{formatCop(invoice.amount, invoice.currency)}</Text>
        </View>

        {invoice.paymentInstructions ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instrucciones de pago</Text>
            <Text style={styles.concept}>{invoice.paymentInstructions}</Text>
          </View>
        ) : null}

        {invoice.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.concept}>{invoice.notes}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text>
            Documento generado por {billingIssuer.brand} · {billingIssuer.website}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
