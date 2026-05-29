import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import { getInvoiceSummaryStats } from "@/lib/billing/invoices";

export async function GET(request: Request) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const stats = await getInvoiceSummaryStats();
  return NextResponse.json(stats);
}
