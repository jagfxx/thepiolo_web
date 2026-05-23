import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import {
  createPaymentMethod,
  listPaymentMethods,
} from "@/lib/billing/payment-methods";
import { createPaymentMethodSchema } from "@/lib/billing/validators";

export async function GET(request: Request) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const items = await listPaymentMethods(authResult.userId);
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

  const parsed = createPaymentMethodSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const method = await createPaymentMethod(authResult.userId, parsed.data);
  return NextResponse.json(method, { status: 201 });
}
