import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import { createApiKey, listApiKeys } from "@/lib/billing/api-keys";
import { createApiKeySchema } from "@/lib/billing/validators";

export async function GET(request: Request) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const keys = await listApiKeys(authResult.userId);
  return NextResponse.json({ items: keys });
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

  const parsed = createApiKeySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const key = await createApiKey(authResult.userId, parsed.data.name);
  return NextResponse.json(
    {
      ...key,
      message: "Guarda esta clave ahora. No se volverá a mostrar.",
    },
    { status: 201 },
  );
}
