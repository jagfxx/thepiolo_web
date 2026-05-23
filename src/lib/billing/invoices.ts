import type { Invoice, InvoiceStatus, Prisma } from "@prisma/client";
import { resolveInvoicePaymentInstructions } from "@/lib/billing/payment-methods";
import type { CreateInvoiceInput, UpdateInvoiceInput } from "@/lib/billing/validators";
import { prisma } from "@/lib/db";

export type InvoiceDto = {
  id: string;
  number: string;
  issuedAt: string;
  dueAt: string | null;
  clientName: string;
  clientId: string | null;
  clientEmail: string | null;
  concept: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paymentInstructions: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export function serializeInvoice(invoice: Invoice): InvoiceDto {
  return {
    id: invoice.id,
    number: invoice.number,
    issuedAt: invoice.issuedAt.toISOString(),
    dueAt: invoice.dueAt?.toISOString() ?? null,
    clientName: invoice.clientName,
    clientId: invoice.clientId,
    clientEmail: invoice.clientEmail,
    concept: invoice.concept,
    amount: Number(invoice.amount),
    currency: invoice.currency,
    status: invoice.status,
    paymentInstructions: invoice.paymentInstructions,
    notes: invoice.notes,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
  };
}

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

export async function createInvoice(
  userId: string,
  input: CreateInvoiceInput,
): Promise<InvoiceDto> {
  const issuedAt = input.issuedAt ?? new Date();
  const number = await nextInvoiceNumber(issuedAt);

  const paymentInstructions = await resolveInvoicePaymentInstructions(userId, {
    paymentMethodIds: input.paymentMethodIds,
    paymentInstructions: input.paymentInstructions,
    paymentExtraNotes: input.paymentExtraNotes,
  });

  const invoice = await prisma.invoice.create({
    data: {
      number,
      issuedAt,
      dueAt: input.dueAt ?? null,
      clientName: input.clientName,
      clientId: input.clientId || null,
      clientEmail: input.clientEmail || null,
      concept: input.concept,
      amount: input.amount,
      currency: input.currency ?? "COP",
      status: input.status ?? "ISSUED",
      paymentInstructions,
      notes: input.notes || null,
      createdById: userId,
    },
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
    }),
    prisma.invoice.count({ where }),
  ]);

  return { items: items.map(serializeInvoice), total };
}

export async function getInvoiceById(id: string): Promise<InvoiceDto | null> {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  return invoice ? serializeInvoice(invoice) : null;
}

export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput,
): Promise<InvoiceDto | null> {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        clientName: input.clientName,
        clientId: input.clientId === "" ? null : input.clientId,
        clientEmail: input.clientEmail === "" ? null : input.clientEmail,
        concept: input.concept,
        amount: input.amount,
        currency: input.currency,
        issuedAt: input.issuedAt,
        dueAt: input.dueAt,
        status: input.status,
        paymentInstructions: input.paymentInstructions,
        notes: input.notes === "" ? null : input.notes,
      },
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
