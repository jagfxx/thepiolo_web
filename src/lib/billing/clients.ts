import type { BillingClient, ClientIdType } from "@prisma/client";
import type { CreateBillingClientInput, UpdateBillingClientInput } from "@/lib/billing/validators";
import { prisma } from "@/lib/db";

export type BillingClientDto = {
  id: string;
  name: string;
  idType: ClientIdType | null;
  idNumber: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

export function serializeBillingClient(client: BillingClient): BillingClientDto {
  return {
    id: client.id,
    name: client.name,
    idType: client.idType,
    idNumber: client.idNumber,
    email: client.email,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}

export function formatClientIdLabel(
  idType: ClientIdType | null,
  idNumber: string | null,
): string | null {
  if (!idNumber) return null;
  if (idType === "NIT") return `NIT: ${idNumber}`;
  if (idType === "CC") return `CC: ${idNumber}`;
  return idNumber;
}

export async function listBillingClients(userId: string): Promise<BillingClientDto[]> {
  const items = await prisma.billingClient.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
  return items.map(serializeBillingClient);
}

export async function getBillingClientById(
  userId: string,
  id: string,
): Promise<BillingClientDto | null> {
  const client = await prisma.billingClient.findFirst({ where: { id, userId } });
  return client ? serializeBillingClient(client) : null;
}

export async function createBillingClient(
  userId: string,
  input: CreateBillingClientInput,
): Promise<BillingClientDto> {
  const client = await prisma.billingClient.create({
    data: {
      userId,
      name: input.name,
      idType: input.idType ?? null,
      idNumber: input.idNumber || null,
      email: input.email || null,
    },
  });
  return serializeBillingClient(client);
}

export async function updateBillingClient(
  userId: string,
  id: string,
  input: UpdateBillingClientInput,
): Promise<BillingClientDto | null> {
  try {
    const client = await prisma.billingClient.update({
      where: { id, userId },
      data: {
        name: input.name,
        idType: input.idType,
        idNumber: input.idNumber === "" ? null : input.idNumber,
        email: input.email === "" ? null : input.email,
      },
    });
    return serializeBillingClient(client);
  } catch {
    return null;
  }
}

export async function deleteBillingClient(userId: string, id: string): Promise<boolean> {
  const result = await prisma.billingClient.deleteMany({ where: { id, userId } });
  return result.count > 0;
}

export async function upsertBillingClientFromInvoice(
  userId: string,
  data: {
    name: string;
    idType?: ClientIdType | null;
    idNumber?: string | null;
    email?: string | null;
  },
): Promise<BillingClientDto> {
  const idNumber = data.idNumber || null;
  if (idNumber) {
    const existing = await prisma.billingClient.findFirst({
      where: { userId, idNumber },
    });
    if (existing) {
      const updated = await prisma.billingClient.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          idType: data.idType ?? existing.idType,
          email: data.email || existing.email,
        },
      });
      return serializeBillingClient(updated);
    }
  }

  return createBillingClient(userId, {
    name: data.name,
    idType: data.idType ?? undefined,
    idNumber: idNumber ?? undefined,
    email: data.email ?? undefined,
  });
}
