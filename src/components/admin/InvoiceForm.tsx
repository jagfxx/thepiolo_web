"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { ClientIdType, InvoiceStatus } from "@prisma/client";
import {
  ClientIdFields,
  createInitialLineItems,
  LineItemsEditor,
  type LineItemDraft,
} from "@/components/admin/LineItemsEditor";
import type { BillingClientDto } from "@/lib/billing/clients";
import type { InvoiceDto } from "@/lib/billing/invoices";
import {
  formatPaymentInstructions,
  partitionPaymentMethods,
  paymentMethodSummary,
  type PaymentMethodDto,
} from "@/lib/billing/payment-methods";

type InvoiceFormProps = {
  paymentMethods: PaymentMethodDto[];
  clients: BillingClientDto[];
  invoice?: InvoiceDto;
};

const today = new Date().toISOString().slice(0, 10);

function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

export function InvoiceForm({ paymentMethods, clients, invoice }: InvoiceFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(invoice);
  const isDraft = invoice?.status === "DRAFT";
  const isIssuedEdit = isEdit && !isDraft && invoice?.status !== "CANCELLED";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedClientId, setSelectedClientId] = useState(invoice?.billingClientId ?? "");
  const [clientName, setClientName] = useState(invoice?.clientName ?? "");
  const [clientIdType, setClientIdType] = useState<ClientIdType | "">(
    invoice?.clientIdType ?? "",
  );
  const [clientIdNumber, setClientIdNumber] = useState(invoice?.clientId ?? "");
  const [clientEmail, setClientEmail] = useState(invoice?.clientEmail ?? "");
  const [saveClient, setSaveClient] = useState(false);

  const [lineItems, setLineItems] = useState<LineItemDraft[]>(() =>
    createInitialLineItems(invoice?.lineItems),
  );

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

  const paymentPreview = useMemo(
    () => formatPaymentInstructions(selectedMethods),
    [selectedMethods],
  );

  const { bankAccounts, brebKeys } = useMemo(
    () => partitionPaymentMethods(paymentMethods),
    [paymentMethods],
  );

  function applyClient(clientId: string) {
    setSelectedClientId(clientId);
    if (!clientId) return;

    const client = clients.find((item) => item.id === clientId);
    if (!client) return;

    setClientName(client.name);
    setClientIdType(client.idType ?? "");
    setClientIdNumber(client.idNumber ?? "");
    setClientEmail(client.email ?? "");
    setSaveClient(false);
  }

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

  function validateBeforeSubmit(): string | null {
    if (paymentMethods.length === 0) {
      return "Configura al menos un método de pago antes de crear una cuenta de cobro";
    }
    if (selectedIds.length === 0) {
      return "Selecciona al menos un método de pago";
    }
    if (!clientName.trim()) {
      return "El nombre del cliente es obligatorio";
    }
    if (clientIdNumber && !clientIdType) {
      return "Selecciona NIT o CC";
    }
    if (lineItems.some((item) => !item.concept.trim())) {
      return "Todos los conceptos deben tener descripción";
    }
    if (lineItems.some((item) => item.amount <= 0)) {
      return "Todos los conceptos deben tener un monto mayor a 0";
    }
    return null;
  }

  async function submitForm(
    e: React.FormEvent<HTMLFormElement>,
    statusOverride?: InvoiceStatus,
  ) {
    e.preventDefault();
    setError(null);

    const validationError = validateBeforeSubmit();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload: Record<string, unknown> = {
      clientName: clientName.trim(),
      clientIdType: clientIdType || undefined,
      clientIdNumber: clientIdNumber || undefined,
      billingClientId: selectedClientId || undefined,
      saveClient: saveClient || undefined,
      clientEmail: clientEmail || undefined,
      lineItems: lineItems.map((item) => ({
        concept: item.concept.trim(),
        amount: item.amount,
      })),
      issuedAt: form.get("issuedAt") || today,
      notes: form.get("notes") || undefined,
      paymentMethodIds: selectedIds,
    };

    if (statusOverride !== undefined) {
      payload.status = statusOverride;
    } else if (!isEdit) {
      payload.status = (form.get("status") as InvoiceStatus) || "ISSUED";
    } else if (isDraft) {
      payload.status = "ISSUED";
    }

    const extra = form.get("paymentExtraNotes");
    if (extra && String(extra).trim()) {
      payload.paymentExtraNotes = String(extra).trim();
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

  if (paymentMethods.length === 0) {
    return (
      <div className="max-w-2xl space-y-4 rounded-3xl border border-border glass p-6 sm:p-8">
        <p className="text-sm text-muted">
          Antes de crear cuentas de cobro debes configurar al menos un método de pago.
        </p>
        <Link
          href="/admin/payment-methods"
          className="inline-flex rounded-full bg-gradient-accent px-6 py-2.5 text-sm font-medium text-white hover:brightness-110"
        >
          Ir a métodos de pago
        </Link>
      </div>
    );
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
      ) : isIssuedEdit ? (
        <p className="rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm text-foreground-subtle">
          Cuenta emitida — puedes modificar cliente, conceptos, métodos de pago y notas.
        </p>
      ) : null}

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Cliente guardado</span>
          <select
            value={selectedClientId}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "__new__") {
                setSelectedClientId("");
                setClientName("");
                setClientIdType("");
                setClientIdNumber("");
                setClientEmail("");
                return;
              }
              applyClient(value);
            }}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          >
            <option value="">Seleccionar cliente…</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
                {client.idNumber ? ` — ${client.idType ?? "ID"} ${client.idNumber}` : ""}
              </option>
            ))}
            <option value="__new__">+ Nuevo cliente</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">
            Nombre o razón social *
          </span>
          <input
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="Nombre o razón social"
          />
        </label>

        <ClientIdFields
          idType={clientIdType}
          idNumber={clientIdNumber}
          onIdTypeChange={setClientIdType}
          onIdNumberChange={setClientIdNumber}
        />

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Correo cliente</span>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            placeholder="Opcional"
          />
        </label>

        {!selectedClientId ? (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground-subtle">
            <input
              type="checkbox"
              checked={saveClient}
              onChange={(e) => setSaveClient(e.target.checked)}
              className="rounded border-border"
            />
            Guardar como cliente para futuras cuentas
          </label>
        ) : null}
      </div>

      <LineItemsEditor items={lineItems} onChange={setLineItems} />

      <div className="grid gap-4 sm:grid-cols-2">
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
          <span className="text-xs font-medium text-muted">Métodos de pago en el PDF *</span>
          <Link
            href="/admin/payment-methods"
            className="text-xs text-gradient hover:underline"
          >
            Configurar métodos
          </Link>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-surface p-3">
          {renderMethodGroup("Cuenta bancaria", bankAccounts)}
          {bankAccounts.length > 0 && brebKeys.length > 0 ? (
            <div className="border-t border-border pt-3" />
          ) : null}
          {renderMethodGroup("Llave Bre-B", brebKeys)}
        </div>

        {paymentPreview ? (
          <pre className="whitespace-pre-wrap rounded-xl border border-border bg-surface-elevated/50 p-4 font-sans text-xs text-foreground-subtle">
            {paymentPreview}
          </pre>
        ) : null}

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
