import { hashApiKey } from "@/lib/billing/crypto";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export type ApiAuthResult =
  | { ok: true; userId: string; via: "session" | "apiKey" }
  | { ok: false; status: number; message: string };

export async function resolveApiAuth(request: Request): Promise<ApiAuthResult> {
  const bearer = request.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) {
    const raw = bearer.slice(7).trim();
    if (!raw) return { ok: false, status: 401, message: "Missing API key" };

    const keyHash = hashApiKey(raw);
    const apiKey = await prisma.apiKey.findFirst({
      where: { keyHash, revokedAt: null },
    });

    if (!apiKey) return { ok: false, status: 401, message: "Invalid API key" };

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return { ok: true, userId: apiKey.userId, via: "apiKey" };
  }

  const session = await auth();
  if (session?.user?.id) {
    return { ok: true, userId: session.user.id, via: "session" };
  }

  return { ok: false, status: 401, message: "Unauthorized" };
}
