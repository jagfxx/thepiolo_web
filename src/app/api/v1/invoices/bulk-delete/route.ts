import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveApiAuth } from "@/lib/api-auth";
import { deleteInvoices } from "@/lib/billing/invoices";

const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

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

  const parsed = bulkDeleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const deleted = await deleteInvoices(authResult.userId, parsed.data.ids);
  return NextResponse.json({ ok: true, deleted });
}
