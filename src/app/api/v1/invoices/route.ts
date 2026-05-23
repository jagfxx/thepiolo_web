import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import { createInvoiceSchema } from "@/lib/billing/validators";
import { createInvoice, listInvoices } from "@/lib/billing/invoices";
import type { InvoiceStatus } from "@prisma/client";

export async function GET(request: Request) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as InvoiceStatus | null;
  const limit = Number(searchParams.get("limit") ?? "50");
  const offset = Number(searchParams.get("offset") ?? "0");

  const data = await listInvoices({
    status: status ?? undefined,
    limit: Number.isFinite(limit) ? limit : 50,
    offset: Number.isFinite(offset) ? offset : 0,
  });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const invoice = await createInvoice(authResult.userId, parsed.data);
  return NextResponse.json(invoice, { status: 201 });
}
