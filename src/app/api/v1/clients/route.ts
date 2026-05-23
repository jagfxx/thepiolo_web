import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import {
  createBillingClient,
  listBillingClients,
} from "@/lib/billing/clients";
import { createBillingClientSchema } from "@/lib/billing/validators";

export async function GET(request: Request) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const items = await listBillingClients(authResult.userId);
  return NextResponse.json({ items });
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

  const parsed = createBillingClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const client = await createBillingClient(authResult.userId, parsed.data);
  return NextResponse.json(client, { status: 201 });
}
