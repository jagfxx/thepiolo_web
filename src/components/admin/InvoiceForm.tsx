"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { billingIssuer } from "@/lib/billing/issuer";
import {
  formatPaymentInstructions,
  partitionPaymentMethods,
  paymentMethodSummary,
  type PaymentMethodDto,
} from "@/lib/billing/payment-methods";

type InvoiceFormProps = {
  paymentMethods: PaymentMethodDto[];
};

export function InvoiceForm({ paymentMethods }: InvoiceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultSelectedIds = useMemo(() => {
    const defaults = paymentMethods.filter((m) => m.isDefault).map((m) => m.id);
    if (defaults.length > 0) return defaults;
    return paymentMethods.map((m) => m.id);
  }, [paymentMethods]);

  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);

  const selectedMethods = useMemo(
    () =>
      selectedIds
        .map((id) => paymentMethods.find((m) => m.id === id))
        .filter((m): m is PaymentMethodDto => Boolean(m)),
    [paymentMethods, selectedIds],
  );

  const paymentPreview = useMemo(() => {
    if (selectedMethods.length === 0) return billingIssuer.defaultPaymentInstructions;
    return formatPaymentInstructions(selectedMethods);
  }, [selectedMethods]);

  const { bankAccounts, brebKeys } = useMemo(
    () => partitionPaymentMethods(paymentMethods),
    [paymentMethods],
  );

  function toggleMethod(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function renderMethodGroup(title: string, methods: PaymentMethodDto[]) {
    if (methods.length === 0) return null;

    return (
      <div className="space-y-2">
        <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted">{title}</p>
        <ul className="space-y-1">
          {methods.map((method) => (
            <li key={method.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-surface-elevated">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(method.id)}
                  onChange={() => toggleMethod(method.id)}
                  className="mt-1 rounded border-border"
                />
                <span className="text-sm text-foreground">
                  {paymentMethodSummary(method)}
                  {method.isDefault ? (
                    <span className="ml-2 text-xs text-muted">(predeterminado)</span>
                  ) : null}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      clientName: form.get("clientName"),
      clientId: form.get("clientId") || undefined,
      clientEmail: form.get("clientEmail") || undefined,
      concept: form.get("concept"),
      amount: form.get("amount"),
      dueAt: form.get("dueAt") || undefined,
      notes: form.get("notes") || undefined,
      status: form.get("status") || "ISSUED",
    };

    if (paymentMethods.length > 0) {
      if (selectedIds.length === 0) {
        setError("Selecciona al menos un método de pago");
        setLoading(false);
        return;
      }
      payload.paymentMethodIds = selectedIds;
      const extra = form.get("paymentExtraNotes");
      if (extra && String(extra).trim()) {
        payload.paymentExtraNotes = String(extra).trim();
      }
    } else {
      payload.paymentInstructions = form.get("paymentInstructions") || undefined;
    }

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

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted">Métodos de pago en el PDF</span>
          <Link
            href="/admin/payment-methods"
            className="text-xs text-gradient hover:underline"
          >
            Configurar métodos
          </Link>
        </div>

        {paymentMethods.length > 0 ? (
          <>
            <div className="space-y-4 rounded-xl border border-border bg-surface p-3">
              {renderMethodGroup("Cuenta bancaria", bankAccounts)}
              {bankAccounts.length > 0 && brebKeys.length > 0 ? (
                <div className="border-t border-border pt-3" />
              ) : null}
              {renderMethodGroup("Llave Bre-B", brebKeys)}
            </div>
            <pre className="whitespace-pre-wrap rounded-xl border border-border bg-surface-elevated/50 p-4 font-sans text-xs text-foreground-subtle">
              {paymentPreview}
            </pre>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted">
                Notas adicionales de pago (opcional)
              </span>
              <textarea
                name="paymentExtraNotes"
                rows={2}
                className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
                placeholder="Ej: Enviar comprobante por WhatsApp"
              />
            </label>
          </>
        ) : (
          <>
            <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
              No tienes métodos de pago guardados.{" "}
              <Link href="/admin/payment-methods" className="text-gradient hover:underline">
                Configúralos aquí
              </Link>{" "}
              para no escribir los datos cada vez.
            </p>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted">
                Instrucciones de pago
              </span>
              <textarea
                name="paymentInstructions"
                rows={3}
                defaultValue={billingIssuer.defaultPaymentInstructions}
                className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
              />
            </label>
          </>
        )}
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Notas</span>
        <textarea
          name="notes"
          rows={2}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          placeholder="Opcional"
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

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
