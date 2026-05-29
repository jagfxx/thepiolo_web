"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { InvoiceDto, InvoiceSummaryStats } from "@/lib/billing/invoices";
import { formatCop, invoiceRowClass } from "@/lib/billing/invoices";
import { statusLabels } from "@/lib/billing/brand";

type InvoiceListManagerProps = {
  initialInvoices: InvoiceDto[];
  initialStats: InvoiceSummaryStats;
};

const statCards: {
  key: keyof InvoiceSummaryStats;
  label: string;
  hint: string;
  accent: string;
}[] = [
  {
    key: "owed",
    label: "Total por cobrar",
    hint: "Emitidas y borradores pendientes",
    accent: "text-amber-300",
  },
  {
    key: "paid",
    label: "Total pagado",
    hint: "Todas las cuentas pagadas",
    accent: "text-emerald-300",
  },
  {
    key: "paidThisMonth",
    label: "Pagado este mes",
    hint: "Marcadas como pagadas en el mes actual",
    accent: "text-emerald-300",
  },
  {
    key: "pendingThisMonth",
    label: "Pendiente este mes",
    hint: "Emitidas en el mes actual sin pagar",
    accent: "text-amber-300",
  },
];

export function InvoiceListManager({
  initialInvoices,
  initialStats,
}: InvoiceListManagerProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [stats, setStats] = useState(initialStats);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const allSelected = invoices.length > 0 && selectedIds.size === invoices.length;
  const someSelected = selectedIds.size > 0;

  const monthLabel = useMemo(
    () =>
      new Date().toLocaleDateString("es-CO", {
        month: "long",
        year: "numeric",
      }),
    [],
  );

  function exitSelectionMode() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelectionMode() {
    if (selectionMode) {
      exitSelectionMode();
      return;
    }
    setSelectionMode(true);
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(invoices.map((inv) => inv.id)));
  }

  async function refreshStats() {
    const res = await fetch("/api/v1/invoices/stats");
    if (!res.ok) return;
    const data = (await res.json()) as InvoiceSummaryStats;
    setStats(data);
  }

  async function deleteSelected() {
    if (!someSelected) return;
    const count = selectedIds.size;
    if (!confirm(`¿Eliminar ${count} cuenta${count === 1 ? "" : "s"} de cobro?`)) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/v1/invoices/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selectedIds] }),
      });
      if (!res.ok) return;

      setInvoices((prev) => prev.filter((inv) => !selectedIds.has(inv.id)));
      exitSelectionMode();
      await refreshStats();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-border glass p-5"
          >
            <p className="text-xs uppercase tracking-wider text-muted">{card.label}</p>
            <p className={`mt-2 font-display text-2xl font-semibold ${card.accent}`}>
              {formatCop(stats[card.key])}
            </p>
            <p className="mt-1 text-xs text-muted">{card.hint}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted">Resumen de {monthLabel}</p>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">{invoices.length} registros recientes</p>
        <div className="flex flex-wrap items-center gap-2">
          {selectionMode ? (
            <>
              <button
                type="button"
                onClick={toggleAll}
                className="rounded-full border border-border px-4 py-2 text-sm text-foreground-subtle hover:text-foreground"
              >
                {allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                disabled={!someSelected || deleting}
                className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:border-red-500/50 disabled:opacity-50"
              >
                {deleting
                  ? "Eliminando…"
                  : `Eliminar${someSelected ? ` (${selectedIds.size})` : ""}`}
              </button>
              <button
                type="button"
                onClick={exitSelectionMode}
                className="rounded-full border border-border px-4 py-2 text-sm text-foreground-subtle hover:text-foreground"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              {invoices.length > 0 ? (
                <button
                  type="button"
                  onClick={toggleSelectionMode}
                  className="rounded-full border border-border px-4 py-2 text-sm text-foreground-subtle hover:text-foreground"
                >
                  Seleccionar
                </button>
              ) : null}
              <Link
                href="/admin/invoices/new"
                className="rounded-full bg-gradient-accent px-6 py-2.5 text-sm font-medium text-white hover:brightness-110"
              >
                + Nueva cuenta
              </Link>
            </>
          )}
        </div>
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
                {selectionMode ? (
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Seleccionar todas las cuentas"
                      className="h-4 w-4 rounded border-border accent-[#B440FF]"
                    />
                  </th>
                ) : null}
                <th className="px-4 py-3">Número</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                {!selectionMode ? <th className="px-4 py-3" /> : null}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className={`${invoiceRowClass(inv.status)} ${
                    selectedIds.has(inv.id) ? "ring-1 ring-inset ring-[#B440FF]/40" : ""
                  }`}
                >
                  {selectionMode ? (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(inv.id)}
                        onChange={() => toggleOne(inv.id)}
                        aria-label={`Seleccionar ${inv.number}`}
                        className="h-4 w-4 rounded border-border accent-[#B440FF]"
                      />
                    </td>
                  ) : null}
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
                  {!selectionMode ? (
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="text-xs text-gradient hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
