export const dynamic = "force-dynamic";

import Link from "next/link";
import { BrandLogo } from "@/components/admin/BrandLogo";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatCop, serializeInvoice } from "@/lib/billing/invoices";
import { statusLabels } from "@/lib/billing/brand";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    take: 100,
  });

  return (
    <AdminShell title="Cuentas de cobro">
      <div className="mb-8 flex justify-center rounded-2xl border border-border/60 bg-surface/40 px-6 py-6">
        <BrandLogo variant="full" size="lg" subtitle="Cuentas de cobro" />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">{invoices.length} registros recientes</p>
        <Link
          href="/admin/invoices/new"
          className="rounded-full bg-gradient-accent px-6 py-2.5 text-sm font-medium text-white hover:brightness-110"
        >
          + Nueva cuenta
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-border glass p-10 text-center text-muted">
          Aún no hay cuentas de cobro. Crea la primera.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Número</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((row) => {
                const inv = serializeInvoice(row);
                return (
                  <tr key={inv.id} className="border-b border-border/60 hover:bg-surface/50">
                    <td className="px-4 py-3 font-mono text-xs">{inv.number}</td>
                    <td className="px-4 py-3">{inv.clientName}</td>
                    <td className="px-4 py-3">{formatCop(inv.amount, inv.currency)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                        {statusLabels[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(inv.issuedAt).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="text-xs text-gradient hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
