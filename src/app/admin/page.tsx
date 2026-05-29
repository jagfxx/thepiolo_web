export const dynamic = "force-dynamic";

import { BrandLogo } from "@/components/admin/BrandLogo";
import { AdminShell } from "@/components/admin/AdminShell";
import { InvoiceListManager } from "@/components/admin/InvoiceListManager";
import { getInvoiceSummaryStats, serializeInvoice } from "@/lib/billing/invoices";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [invoices, stats] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { issuedAt: "desc" },
      take: 100,
      include: { lineItems: { orderBy: { sortOrder: "asc" } } },
    }),
    getInvoiceSummaryStats(),
  ]);

  return (
    <AdminShell title="Cuentas de cobro">
      <div className="mb-8 flex justify-center rounded-2xl border border-border/60 bg-surface/40 px-6 py-6">
        <BrandLogo variant="full" size="lg" subtitle="Cuentas de cobro" />
      </div>

      <InvoiceListManager
        initialInvoices={invoices.map(serializeInvoice)}
        initialStats={stats}
      />
    </AdminShell>
  );
}
