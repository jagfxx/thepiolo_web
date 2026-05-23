import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import { getInvoiceById, updateInvoice } from "@/lib/billing/invoices";
import { updateInvoiceSchema } from "@/lib/billing/validators";

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

  return NextResponse.json(invoice);
}

export async function PATCH(request: Request, { params }: Params) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const invoice = await updateInvoice(id, parsed.data, authResult.userId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice);
}
