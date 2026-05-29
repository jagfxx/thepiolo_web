import type { ClientIdType, Invoice, InvoiceLineItem, InvoiceStatus, Prisma } from "@prisma/client";
import { formatClientIdLabel, upsertBillingClientFromInvoice } from "@/lib/billing/clients";
import { resolveInvoicePaymentInstructions } from "@/lib/billing/payment-methods";
import type { CreateInvoiceInput, UpdateInvoiceInput } from "@/lib/billing/validators";
import { prisma } from "@/lib/db";

export type InvoiceLineItemDto = {
  id: string;
  concept: string;
  amount: number;
  sortOrder: number;
};

export type InvoiceDto = {
  id: string;
  number: string;
  issuedAt: string;
  dueAt: string | null;
  clientName: string;
  clientIdType: ClientIdType | null;
  clientId: string | null;
  clientEmail: string | null;
  billingClientId: string | null;
  concept: string;
  lineItems: InvoiceLineItemDto[];
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paymentInstructions: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type InvoiceWithLineItems = Invoice & { lineItems?: InvoiceLineItem[] };

function serializeLineItem(item: InvoiceLineItem): InvoiceLineItemDto {
  return {
    id: item.id,
    concept: item.concept,
    amount: Number(item.amount),
    sortOrder: item.sortOrder,
  };
}

export function serializeInvoice(invoice: InvoiceWithLineItems): InvoiceDto {
  const lineItems =
    invoice.lineItems && invoice.lineItems.length > 0
      ? [...invoice.lineItems]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(serializeLineItem)
      : [
          {
            id: `${invoice.id}-legacy`,
            concept: invoice.concept,
            amount: Number(invoice.amount),
            sortOrder: 0,
          },
        ];

  return {
    id: invoice.id,
    number: invoice.number,
    issuedAt: invoice.issuedAt.toISOString(),
    dueAt: invoice.dueAt?.toISOString() ?? null,
    clientName: invoice.clientName,
    clientIdType: invoice.clientIdType,
    clientId: invoice.clientId,
    clientEmail: invoice.clientEmail,
    billingClientId: invoice.billingClientId,
    concept: invoice.concept,
    lineItems,
    amount: Number(invoice.amount),
    currency: invoice.currency,
    status: invoice.status,
    paymentInstructions: invoice.paymentInstructions,
    notes: invoice.notes,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
  };
}

export { formatClientIdLabel };

const invoiceInclude = {
  lineItems: { orderBy: { sortOrder: "asc" as const } },
};

async function nextInvoiceNumber(issuedAt: Date): Promise<string> {
  const year = issuedAt.getFullYear();

  const counter = await prisma.$transaction(async (tx) => {
    const existing = await tx.invoiceCounter.findUnique({ where: { year } });
    if (existing) {
      return tx.invoiceCounter.update({
        where: { year },
        data: { lastSeq: { increment: 1 } },
      });
    }
    return tx.invoiceCounter.create({
      data: { year, lastSeq: 1 },
    });
  });

  const seq = String(counter.lastSeq).padStart(4, "0");
  return `CC-${year}-${seq}`;
}

function summarizeConcepts(lineItems: { concept: string }[]): string {
  return lineItems.map((item) => item.concept).join(" · ");
}

function totalAmount(lineItems: { amount: number }[]): number {
  return lineItems.reduce((sum, item) => sum + item.amount, 0);
}

async function resolveBillingClientId(
  userId: string,
  input: Pick<
    CreateInvoiceInput,
    "billingClientId" | "saveClient" | "clientName" | "clientIdType" | "clientIdNumber" | "clientEmail"
  >,
): Promise<string | null> {
  if (input.billingClientId) {
    const existing = await prisma.billingClient.findFirst({
      where: { id: input.billingClientId, userId },
    });
    if (existing) return existing.id;
  }

  if (input.saveClient) {
    const saved = await upsertBillingClientFromInvoice(userId, {
      name: input.clientName,
      idType: input.clientIdType ?? null,
      idNumber: input.clientIdNumber?.trim() || null,
      email: input.clientEmail || null,
    });
    return saved.id;
  }

  return input.billingClientId ?? null;
}

export async function createInvoice(
  userId: string,
  input: CreateInvoiceInput,
): Promise<InvoiceDto> {
  const issuedAt = input.issuedAt ?? new Date();
  const number = await nextInvoiceNumber(issuedAt);
  const lineItems = input.lineItems;
  const amount = totalAmount(lineItems);
  const concept = summarizeConcepts(lineItems);

  const paymentInstructions = await resolveInvoicePaymentInstructions(userId, {
    paymentMethodIds: input.paymentMethodIds,
    paymentExtraNotes: input.paymentExtraNotes,
  });

  const billingClientId = await resolveBillingClientId(userId, input);

  const invoice = await prisma.invoice.create({
    data: {
      number,
      issuedAt,
      dueAt: null,
      clientName: input.clientName,
      clientIdType: input.clientIdType ?? null,
      clientId: input.clientIdNumber?.trim() || null,
      clientEmail: input.clientEmail || null,
      billingClientId,
      concept,
      amount,
      currency: input.currency ?? "COP",
      status: input.status ?? "ISSUED",
      paymentInstructions,
      notes: input.notes || null,
      createdById: userId,
      lineItems: {
        create: lineItems.map((item, index) => ({
          concept: item.concept,
          amount: item.amount,
          sortOrder: index,
        })),
      },
    },
    include: invoiceInclude,
  });

  return serializeInvoice(invoice);
}

export async function listInvoices(params?: {
  status?: InvoiceStatus;
  limit?: number;
  offset?: number;
}): Promise<{ items: InvoiceDto[]; total: number }> {
  const where: Prisma.InvoiceWhereInput = {};
  if (params?.status) where.status = params.status;

  const [items, total] = await prisma.$transaction([
    prisma.invoice.findMany({
      where,
      orderBy: { issuedAt: "desc" },
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0,
      include: invoiceInclude,
    }),
    prisma.invoice.count({ where }),
  ]);

  return { items: items.map(serializeInvoice), total };
}

export async function getInvoiceById(id: string): Promise<InvoiceDto | null> {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: invoiceInclude,
  });
  return invoice ? serializeInvoice(invoice) : null;
}

export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput,
  userId?: string,
): Promise<InvoiceDto | null> {
  const existing = await prisma.invoice.findUnique({
    where: { id },
    include: invoiceInclude,
  });
  if (!existing) return null;

  const isEditable = existing.status !== "CANCELLED";
  const data: Prisma.InvoiceUpdateInput = {};

  if (input.status !== undefined) {
    data.status = input.status;
  }

  if (isEditable) {
    if (input.clientName !== undefined) data.clientName = input.clientName;
    if (input.clientIdType !== undefined) {
      data.clientIdType = input.clientIdType ?? null;
    }
    if (input.clientIdNumber !== undefined) {
      data.clientId = input.clientIdNumber === "" ? null : input.clientIdNumber;
    }
    if (input.clientEmail !== undefined) {
      data.clientEmail = input.clientEmail === "" ? null : input.clientEmail;
    }
    if (input.currency !== undefined) data.currency = input.currency;
    if (input.issuedAt !== undefined) data.issuedAt = input.issuedAt;
    if (input.notes !== undefined) data.notes = input.notes === "" ? null : input.notes;

    if (input.lineItems !== undefined) {
      const amount = totalAmount(input.lineItems);
      data.concept = summarizeConcepts(input.lineItems);
      data.amount = amount;
    }

    if (userId && input.paymentMethodIds?.length) {
      data.paymentInstructions = await resolveInvoicePaymentInstructions(userId, {
        paymentMethodIds: input.paymentMethodIds,
        paymentExtraNotes: input.paymentExtraNotes,
      });
    }

    if (userId && (input.saveClient || input.billingClientId)) {
      const billingClientId = await resolveBillingClientId(userId, {
        billingClientId: input.billingClientId,
        saveClient: input.saveClient,
        clientName: input.clientName ?? existing.clientName,
        clientIdType: input.clientIdType ?? existing.clientIdType ?? undefined,
        clientIdNumber: input.clientIdNumber ?? existing.clientId ?? undefined,
        clientEmail: input.clientEmail ?? existing.clientEmail ?? undefined,
      });
      data.billingClient = billingClientId
        ? { connect: { id: billingClientId } }
        : { disconnect: true };
    }
  }

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      if (isEditable && input.lineItems !== undefined) {
        await tx.invoiceLineItem.deleteMany({ where: { invoiceId: id } });
        await tx.invoiceLineItem.createMany({
          data: input.lineItems.map((item, index) => ({
            invoiceId: id,
            concept: item.concept,
            amount: item.amount,
            sortOrder: index,
          })),
        });
      }

      return tx.invoice.update({
        where: { id },
        data,
        include: invoiceInclude,
      });
    });

    return serializeInvoice(invoice);
  } catch {
    return null;
  }
}

export function formatCop(amount: number, currency = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function invoiceRowClass(status: InvoiceStatus): string {
  const base = "border-b border-border/60 transition-colors";
  switch (status) {
    case "PAID":
      return `${base} bg-emerald-500/15 hover:bg-emerald-500/25`;
    case "DRAFT":
      return `${base} bg-amber-500/15 hover:bg-amber-500/25`;
    case "CANCELLED":
      return `${base} bg-red-500/15 hover:bg-red-500/25`;
    default:
      return `${base} hover:bg-surface/50`;
  }
}

export type InvoiceSummaryStats = {
  owed: number;
  paid: number;
  paidThisMonth: number;
  pendingThisMonth: number;
};

function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

export async function getInvoiceSummaryStats(): Promise<InvoiceSummaryStats> {
  const { start, end } = monthRange();
  const pendingStatuses: InvoiceStatus[] = ["ISSUED", "DRAFT"];

  const [owed, paid, paidThisMonth, pendingThisMonth] = await Promise.all([
    prisma.invoice.aggregate({
      where: { status: { in: pendingStatuses } },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: {
        status: "PAID",
        updatedAt: { gte: start, lt: end },
      },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: {
        status: { in: pendingStatuses },
        issuedAt: { gte: start, lt: end },
      },
      _sum: { amount: true },
    }),
  ]);

  return {
    owed: Number(owed._sum.amount ?? 0),
    paid: Number(paid._sum.amount ?? 0),
    paidThisMonth: Number(paidThisMonth._sum.amount ?? 0),
    pendingThisMonth: Number(pendingThisMonth._sum.amount ?? 0),
  };
}

export async function deleteInvoice(userId: string, id: string): Promise<boolean> {
  const result = await prisma.invoice.deleteMany({
    where: { id, createdById: userId },
  });
  return result.count > 0;
}

export async function deleteInvoices(userId: string, ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const result = await prisma.invoice.deleteMany({
    where: { id: { in: ids }, createdById: userId },
  });
  return result.count;
}
