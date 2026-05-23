import { generateApiKey, hashApiKey } from "@/lib/billing/crypto";
import { prisma } from "@/lib/db";

export async function createApiKey(userId: string, name: string) {
  const { raw, prefix } = generateApiKey();
  const record = await prisma.apiKey.create({
    data: {
      name,
      prefix,
      keyHash: hashApiKey(raw),
      userId,
    },
  });

  return {
    id: record.id,
    name: record.name,
    prefix: record.prefix,
    rawKey: raw,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function listApiKeys(userId: string) {
  const keys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return keys.map((k) => ({
    id: k.id,
    name: k.name,
    prefix: k.prefix,
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
    revokedAt: k.revokedAt?.toISOString() ?? null,
    createdAt: k.createdAt.toISOString(),
  }));
}

export async function revokeApiKey(userId: string, keyId: string): Promise<boolean> {
  const result = await prisma.apiKey.updateMany({
    where: { id: keyId, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count > 0;
}
