import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import { getInvoiceById } from "@/lib/billing/invoices";
import { renderInvoicePdf } from "@/lib/billing/pdf";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdf = await renderInvoicePdf(invoice);
  const filename = `${invoice.number}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
