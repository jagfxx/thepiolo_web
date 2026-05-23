import "@/lib/billing/pdf-fonts";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "@/lib/billing/pdf-document";
import type { InvoiceDto } from "@/lib/billing/invoices";

export async function renderInvoicePdf(invoice: InvoiceDto): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <InvoicePdfDocument invoice={invoice} />,
  );
  return Buffer.from(buffer);
}
