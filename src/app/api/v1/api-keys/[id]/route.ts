import { NextResponse } from "next/server";
import { resolveApiAuth } from "@/lib/api-auth";
import { revokeApiKey } from "@/lib/billing/api-keys";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Params) {
  const authResult = await resolveApiAuth(request);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  const { id } = await params;
  const revoked = await revokeApiKey(authResult.userId, id);
  if (!revoked) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
