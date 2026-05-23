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
  paymentMethodIds: z.array(z.string().min(1)).optional(),
  paymentExtraNotes: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  status: invoiceStatusSchema.optional(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(2).max(100),
});

const paymentMethodBaseSchema = z.object({
  holderName: z.string().max(200).optional(),
  isDefault: z.boolean().optional(),
});

export const createPaymentMethodSchema = z
  .discriminatedUnion("type", [
    paymentMethodBaseSchema.extend({
      type: z.literal("BANK_ACCOUNT"),
      bankName: z.string().min(2).max(100),
      accountType: z.enum(["SAVINGS", "CHECKING"]),
      accountNumber: z.string().min(4).max(50),
    }),
    paymentMethodBaseSchema.extend({
      type: z.literal("BREB"),
      brebKey: z.string().min(3).max(100),
    }),
  ]);

export const updatePaymentMethodSchema = z.object({
  type: z.enum(["BANK_ACCOUNT", "BREB"]).optional(),
  bankName: z.string().min(2).max(100).optional().nullable(),
  accountType: z.enum(["SAVINGS", "CHECKING"]).optional().nullable(),
  accountNumber: z.string().min(4).max(50).optional().nullable(),
  brebKey: z.string().min(3).max(100).optional().nullable(),
  holderName: z.string().max(200).optional().nullable(),
  isDefault: z.boolean().optional(),
});

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema> & {
  paymentMethodIds?: string[];
  paymentExtraNotes?: string;
};
