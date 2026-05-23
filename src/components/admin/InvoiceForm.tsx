"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { billingIssuer } from "@/lib/billing/issuer";

type InvoiceFormProps = {
  mode?: "create";
};

export function InvoiceForm({ mode = "create" }: InvoiceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      clientName: form.get("clientName"),
      clientId: form.get("clientId") || undefined,
      clientEmail: form.get("clientEmail") || undefined,
      concept: form.get("concept"),
      amount: form.get("amount"),
      dueAt: form.get("dueAt") || undefined,
      paymentInstructions: form.get("paymentInstructions") || undefined,
      notes: form.get("notes") || undefined,
      status: form.get("status") || "ISSUED",
    };

    try {
      const res = await fetch("/api/v1/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear la cuenta de cobro");
        return;
      }
      router.push(`/admin/invoices/${data.id}`);
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  if (mode !== "create") return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-3xl border border-border glass p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-muted">Cliente *</span>
          <input
            name="clientName"
            required
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="Nombre o razón social"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">NIT / CC</span>
          <input
            name="clientId"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="Opcional"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Correo cliente</span>
          <input
            name="clientEmail"
            type="email"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="Opcional"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Concepto *</span>
        <textarea
          name="concept"
          required
          rows={4}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          placeholder="Descripción del servicio o producto"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Monto (COP) *</span>
          <input
            name="amount"
            type="number"
            min="1"
            required
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="1500000"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Vencimiento</span>
          <input
            name="dueAt"
            type="date"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Estado</span>
          <select
            name="status"
            defaultValue="ISSUED"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          >
            <option value="DRAFT">Borrador</option>
            <option value="ISSUED">Emitida</option>
            <option value="PAID">Pagada</option>
            <option value="CANCELLED">Anulada</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Instrucciones de pago</span>
        <textarea
          name="paymentInstructions"
          rows={3}
          defaultValue={billingIssuer.defaultPaymentInstructions}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Notas</span>
        <textarea
          name="notes"
          rows={2}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          placeholder="Opcional"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gradient-accent px-8 py-3 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Creando…" : "Crear cuenta de cobro"}
      </button>
    </form>
  );
}
