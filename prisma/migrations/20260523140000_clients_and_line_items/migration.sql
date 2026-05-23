-- CreateEnum
CREATE TYPE "ClientIdType" AS ENUM ('NIT', 'CC');

-- CreateTable
CREATE TABLE "BillingClient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idType" "ClientIdType",
    "idNumber" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLineItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceLineItem_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "clientIdType" "ClientIdType",
ADD COLUMN "billingClientId" TEXT;

-- CreateIndex
CREATE INDEX "BillingClient_userId_idx" ON "BillingClient"("userId");

-- CreateIndex
CREATE INDEX "InvoiceLineItem_invoiceId_idx" ON "InvoiceLineItem"("invoiceId");

-- CreateIndex
CREATE INDEX "Invoice_billingClientId_idx" ON "Invoice"("billingClientId");

-- AddForeignKey
ALTER TABLE "BillingClient" ADD CONSTRAINT "BillingClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLineItem" ADD CONSTRAINT "InvoiceLineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_billingClientId_fkey" FOREIGN KEY ("billingClientId") REFERENCES "BillingClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrate existing invoices to line items
INSERT INTO "InvoiceLineItem" ("id", "invoiceId", "concept", "amount", "sortOrder")
SELECT
    gen_random_uuid()::text,
    "id",
    "concept",
    "amount",
    0
FROM "Invoice"
WHERE NOT EXISTS (
    SELECT 1 FROM "InvoiceLineItem" WHERE "InvoiceLineItem"."invoiceId" = "Invoice"."id"
);
