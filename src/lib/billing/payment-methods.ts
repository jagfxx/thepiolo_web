import type { BankAccountType, PaymentMethod, PaymentMethodType } from "@prisma/client";
import { billingIssuer } from "@/lib/billing/issuer";
import type {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "@/lib/billing/validators";
import { prisma } from "@/lib/db";

export type PaymentMethodDto = {
  id: string;
  type: PaymentMethodType;
  label: string | null;
  bankName: string | null;
  accountType: BankAccountType | null;
  accountNumber: string | null;
  brebKey: string | null;
  holderName: string | null;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

const accountTypeLabels: Record<BankAccountType, string> = {
  SAVINGS: "Ahorros",
  CHECKING: "Corriente",
};

export { accountTypeLabels };

export function partitionPaymentMethods(methods: PaymentMethodDto[]) {
  return {
    bankAccounts: methods.filter((m) => m.type === "BANK_ACCOUNT"),
    brebKeys: methods.filter((m) => m.type === "BREB"),
  };
}

export function serializePaymentMethod(method: PaymentMethod): PaymentMethodDto {
  return {
    id: method.id,
    type: method.type,
    label: method.label,
    bankName: method.bankName,
    accountType: method.accountType,
    accountNumber: method.accountNumber,
    brebKey: method.brebKey,
    holderName: method.holderName,
    isDefault: method.isDefault,
    sortOrder: method.sortOrder,
    createdAt: method.createdAt.toISOString(),
    updatedAt: method.updatedAt.toISOString(),
  };
}

export function formatPaymentMethod(method: PaymentMethodDto): string {
  if (method.type === "BREB") {
    const lines: string[] = [];
    if (method.brebKey) lines.push(method.brebKey);
    if (method.holderName) lines.push(`Titular: ${method.holderName}`);
    return lines.join("\n");
  }

  const lines: string[] = [];
  if (method.bankName) lines.push(method.bankName);
  if (method.accountType) lines.push(accountTypeLabels[method.accountType]);
  if (method.accountNumber) lines.push(method.accountNumber);
  if (method.holderName) lines.push(`Titular: ${method.holderName}`);

  return lines.join("\n");
}

export function formatPaymentInstructions(methods: PaymentMethodDto[]): string {
  if (methods.length === 0) return billingIssuer.defaultPaymentInstructions;

  const { bankAccounts, brebKeys } = partitionPaymentMethods(methods);
  const sections: string[] = [];

  if (bankAccounts.length > 0) {
    sections.push(
      ["Cuenta bancaria", ...bankAccounts.map(formatPaymentMethod)].join("\n\n"),
    );
  }
  if (brebKeys.length > 0) {
    sections.push(["Llave Bre-B", ...brebKeys.map(formatPaymentMethod)].join("\n\n"));
  }

  return sections.join("\n\n");
}

export function paymentMethodSummary(method: PaymentMethodDto): string {
  if (method.type === "BREB") {
    return method.brebKey || "Llave Bre-B";
  }
  const typeLabel = method.accountType ? accountTypeLabels[method.accountType] : "";
  return [method.bankName, typeLabel, method.accountNumber].filter(Boolean).join(" · ");
}

async function clearDefaultPaymentMethods(userId: string, exceptId?: string) {
  await prisma.paymentMethod.updateMany({
    where: {
      userId,
      isDefault: true,
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    data: { isDefault: false },
  });
}

export async function listPaymentMethods(userId: string): Promise<PaymentMethodDto[]> {
  const items = await prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return items.map(serializePaymentMethod);
}

export async function listPaymentMethodsByIds(
  userId: string,
  ids: string[],
): Promise<PaymentMethodDto[]> {
  if (ids.length === 0) return [];
  const items = await prisma.paymentMethod.findMany({
    where: { userId, id: { in: ids } },
  });
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids
    .map((id) => byId.get(id))
    .filter((item): item is PaymentMethod => Boolean(item))
    .map(serializePaymentMethod);
}

export async function createPaymentMethod(
  userId: string,
  input: CreatePaymentMethodInput,
): Promise<PaymentMethodDto> {
  if (input.isDefault) {
    await clearDefaultPaymentMethods(userId);
  }

  const method = await prisma.paymentMethod.create({
    data: {
      userId,
      type: input.type,
      label: null,
      bankName: input.type === "BANK_ACCOUNT" ? input.bankName || null : null,
      accountType: input.type === "BANK_ACCOUNT" ? input.accountType || null : null,
      accountNumber: input.type === "BANK_ACCOUNT" ? input.accountNumber || null : null,
      brebKey: input.type === "BREB" ? input.brebKey || null : null,
      holderName: input.holderName || null,
      isDefault: input.isDefault ?? false,
    },
  });

  return serializePaymentMethod(method);
}

export async function updatePaymentMethod(
  userId: string,
  id: string,
  input: UpdatePaymentMethodInput,
): Promise<PaymentMethodDto | null> {
  const existing = await prisma.paymentMethod.findFirst({ where: { id, userId } });
  if (!existing) return null;

  const nextType = input.type ?? existing.type;

  if (input.isDefault) {
    await clearDefaultPaymentMethods(userId, id);
  }

  try {
    const method = await prisma.paymentMethod.update({
      where: { id },
      data: {
        type: input.type,
        bankName:
          nextType === "BANK_ACCOUNT"
            ? (input.bankName ?? existing.bankName)
            : null,
        accountType:
          nextType === "BANK_ACCOUNT"
            ? (input.accountType ?? existing.accountType)
            : null,
        accountNumber:
          nextType === "BANK_ACCOUNT"
            ? (input.accountNumber ?? existing.accountNumber)
            : null,
        brebKey: nextType === "BREB" ? (input.brebKey ?? existing.brebKey) : null,
        holderName: input.holderName === "" ? null : input.holderName,
        isDefault: input.isDefault,
      },
    });
    return serializePaymentMethod(method);
  } catch {
    return null;
  }
}

export async function deletePaymentMethod(userId: string, id: string): Promise<boolean> {
  const result = await prisma.paymentMethod.deleteMany({ where: { id, userId } });
  return result.count > 0;
}

export async function resolveInvoicePaymentInstructions(
  userId: string,
  input: {
    paymentMethodIds?: string[];
    paymentInstructions?: string;
    paymentExtraNotes?: string;
  },
): Promise<string> {
  let base: string;

  if (input.paymentMethodIds?.length) {
    const methods = await listPaymentMethodsByIds(userId, input.paymentMethodIds);
    base =
      methods.length > 0
        ? formatPaymentInstructions(methods)
        : billingIssuer.defaultPaymentInstructions;
  } else if (input.paymentInstructions?.trim()) {
    base = input.paymentInstructions.trim();
  } else {
    base = billingIssuer.defaultPaymentInstructions;
  }

  const extra = input.paymentExtraNotes?.trim();
  if (extra) {
    return `${base}\n\n${extra}`;
  }

  return base;
}
