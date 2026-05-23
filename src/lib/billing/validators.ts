import { z } from "zod";

export const invoiceStatusSchema = z.enum(["DRAFT", "ISSUED", "PAID", "CANCELLED"]);

export const clientIdTypeSchema = z.enum(["NIT", "CC"]);

const digitsOnlySchema = z
  .string()
  .max(20)
  .regex(/^\d+$/, "Solo números")
  .optional()
  .or(z.literal(""));

export const lineItemSchema = z.object({
  concept: z.string().trim().min(1, "Concepto requerido").max(500),
  amount: z.coerce.number().positive("Monto debe ser mayor a 0").max(999_999_999_999),
});

const invoiceFieldsSchema = z.object({
  clientName: z.string().min(2).max(200),
  clientIdType: clientIdTypeSchema.optional(),
  clientIdNumber: digitsOnlySchema,
  billingClientId: z.string().optional(),
  saveClient: z.boolean().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  lineItems: z.array(lineItemSchema).min(1, "Al menos un concepto"),
  currency: z.string().length(3).default("COP"),
  issuedAt: z.coerce.date().optional(),
  dueAt: z.coerce.date().optional().nullable(),
  status: invoiceStatusSchema.optional(),
  paymentMethodIds: z
    .array(z.string().min(1))
    .min(1, "Selecciona al menos un método de pago"),
  paymentExtraNotes: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
});

function refineClientIdFields(
  data: { clientIdNumber?: string; clientIdType?: "NIT" | "CC" },
  ctx: z.RefinementCtx,
) {
  const num = data.clientIdNumber?.trim() ?? "";
  if (num && !data.clientIdType) {
    ctx.addIssue({
      code: "custom",
      message: "Selecciona NIT o CC",
      path: ["clientIdType"],
    });
  }
}

export const createInvoiceSchema = invoiceFieldsSchema.superRefine(refineClientIdFields);

export const updateInvoiceSchema = invoiceFieldsSchema
  .partial()
  .extend({
    status: invoiceStatusSchema.optional(),
  })
  .superRefine(refineClientIdFields);

export const createApiKeySchema = z.object({
  name: z.string().min(2).max(100),
});

export const createBillingClientSchema = z
  .object({
    name: z.string().min(2).max(200),
    idType: clientIdTypeSchema.optional(),
    idNumber: digitsOnlySchema,
    email: z.string().email().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const num = data.idNumber?.trim() ?? "";
    if (num && !data.idType) {
      ctx.addIssue({
        code: "custom",
        message: "Selecciona NIT o CC",
        path: ["idType"],
      });
    }
  });

export const updateBillingClientSchema = createBillingClientSchema;

const paymentMethodBaseSchema = z.object({
  holderName: z.string().max(200).optional(),
  isDefault: z.boolean().optional(),
});

export const createPaymentMethodSchema = z.discriminatedUnion("type", [
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
export type CreateBillingClientInput = z.infer<typeof createBillingClientSchema>;
export type UpdateBillingClientInput = z.infer<typeof updateBillingClientSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema> & {
  paymentMethodIds?: string[];
  paymentExtraNotes?: string;
};
