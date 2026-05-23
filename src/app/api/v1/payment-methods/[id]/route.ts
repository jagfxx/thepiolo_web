import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import { deletePaymentMethod, updatePaymentMethod } from "@/lib/billing/payment-methods";
import { updatePaymentMethodSchema } from "@/lib/billing/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updatePaymentMethodSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const method = await updatePaymentMethod(authResult.userId, id, parsed.data);
  if (!method) {
    return NextResponse.json({ error: "Método de pago no encontrado" }, { status: 404 });
  }

  return NextResponse.json(method);
}

export async function DELETE(request: Request, context: RouteContext) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const { id } = await context.params;
  const deleted = await deletePaymentMethod(authResult.userId, id);
  if (!deleted) {
    return NextResponse.json({ error: "Método de pago no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
