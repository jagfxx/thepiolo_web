import { z } from "zod";

export const invoiceStatusSchema = z.enum(["DRAFT", "ISSUED", "PAID", "CANCELLED"]);

export const createInvoiceSchema = z.object({
  clientName: z.string().min(2).max(200),
  clientId: z.string().max(50).optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  concept: z.string().min(3).max(2000),
  amount: z.coerce.number().positive().max(999_999_999_999),
  currency: z.string().length(3).default("COP"),
  issuedAt: z.coerce.date().optional(),
  dueAt: z.coerce.date().optional().nullable(),
  status: invoiceStatusSchema.optional(),
  paymentInstructions: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  status: invoiceStatusSchema.optional(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(2).max(100),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
