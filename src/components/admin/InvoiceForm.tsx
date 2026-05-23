"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { InvoiceStatus } from "@prisma/client";
import { billingIssuer } from "@/lib/billing/issuer";
import {
  formatPaymentInstructions,
  partitionPaymentMethods,
  paymentMethodSummary,
  type PaymentMethodDto,
} from "@/lib/billing/payment-methods";
import type { InvoiceDto } from "@/lib/billing/invoices";

type InvoiceFormProps = {
  paymentMethods: PaymentMethodDto[];
  invoice?: InvoiceDto;
};

const today = new Date().toISOString().slice(0, 10);

function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

export function InvoiceForm({ paymentMethods, invoice }: InvoiceFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(invoice);
  const isDraft = invoice?.status === "DRAFT";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultSelectedIds = useMemo(() => {
    if (isEdit) return paymentMethods.map((m) => m.id);
    const defaults = paymentMethods.filter((m) => m.isDefault).map((m) => m.id);
    if (defaults.length > 0) return defaults;
    return paymentMethods.map((m) => m.id);
  }, [paymentMethods, isEdit]);

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

  async function submitForm(
    e: React.FormEvent<HTMLFormElement>,
    statusOverride?: InvoiceStatus,
  ) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const status =
      statusOverride ?? (form.get("status") as InvoiceStatus) ?? (isEdit ? "ISSUED" : "ISSUED");

    const payload: Record<string, unknown> = {
      clientName: form.get("clientName"),
      clientId: form.get("clientId") || undefined,
      clientEmail: form.get("clientEmail") || undefined,
      concept: form.get("concept"),
      amount: form.get("amount"),
      issuedAt: form.get("issuedAt") || today,
      notes: form.get("notes") || undefined,
      status,
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
      const url = isEdit ? `/api/v1/invoices/${invoice!.id}` : "/api/v1/invoices";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al guardar la cuenta de cobro");
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

  async function saveWithStatus(statusOverride: InvoiceStatus) {
    if (!formRef.current) return;
    const event = {
      preventDefault: () => {},
      currentTarget: formRef.current,
    } as React.FormEvent<HTMLFormElement>;
    await submitForm(event, statusOverride);
  }

  return (
    <form
      ref={formRef}
      onSubmit={(e) => submitForm(e, isDraft ? "ISSUED" : undefined)}
      className="max-w-2xl space-y-6 rounded-3xl border border-border glass p-6 sm:p-8"
    >
      {isDraft ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
          Borrador — puedes editar todos los campos y emitir cuando esté listo.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-muted">Cliente *</span>
          <input
            name="clientName"
            required
            defaultValue={invoice?.clientName}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="Nombre o razón social"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">NIT / CC</span>
          <input
            name="clientId"
            defaultValue={invoice?.clientId ?? ""}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="Opcional"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Correo cliente</span>
          <input
            name="clientEmail"
            type="email"
            defaultValue={invoice?.clientEmail ?? ""}
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
          defaultValue={invoice?.concept}
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
            defaultValue={invoice?.amount}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="1500000"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Fecha de emisión *</span>
          <input
            name="issuedAt"
            type="date"
            required
            defaultValue={invoice ? toDateInput(invoice.issuedAt) : today}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          />
        </label>
        {!isEdit ? (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">Estado</span>
            <select
              name="status"
              defaultValue="ISSUED"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            >
              <option value="ISSUED">Emitida</option>
              <option value="PAID">Pagada</option>
              <option value="CANCELLED">Anulada</option>
            </select>
          </label>
        ) : null}
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
                defaultValue={invoice?.paymentInstructions ?? billingIssuer.defaultPaymentInstructions}
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
          defaultValue={invoice?.notes ?? ""}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          placeholder="Opcional"
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {!isEdit ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => saveWithStatus("DRAFT")}
            className="rounded-full border border-border px-6 py-3 text-sm text-foreground-subtle transition-colors hover:border-border-hover hover:text-foreground disabled:opacity-60"
          >
            {loading ? "Guardando…" : "Guardar borrador"}
          </button>
        ) : isDraft ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => saveWithStatus("DRAFT")}
            className="rounded-full border border-border px-6 py-3 text-sm text-foreground-subtle transition-colors hover:border-border-hover hover:text-foreground disabled:opacity-60"
          >
            {loading ? "Guardando…" : "Guardar borrador"}
          </button>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gradient-accent px-8 py-3 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
        >
          {loading
            ? "Guardando…"
            : isDraft
              ? "Emitir cuenta de cobro"
              : isEdit
                ? "Guardar cambios"
                : "Crear cuenta de cobro"}
        </button>
      </div>
    </form>
  );
}
