"use client";

import { useMemo, useState } from "react";
import {
  formatPaymentMethod,
  partitionPaymentMethods,
  paymentMethodSummary,
  type PaymentMethodDto,
} from "@/lib/billing/payment-methods";

type PaymentMethodFormState = {
  type: "BANK_ACCOUNT" | "BREB";
  bankName: string;
  accountType: "SAVINGS" | "CHECKING";
  accountNumber: string;
  brebKey: string;
  holderName: string;
  isDefault: boolean;
};

const emptyForm = (): PaymentMethodFormState => ({
  type: "BANK_ACCOUNT",
  bankName: "",
  accountType: "SAVINGS",
  accountNumber: "",
  brebKey: "",
  holderName: "",
  isDefault: false,
});

function SavedMethodCard({
  method,
  onSetDefault,
  onRemove,
}: {
  method: PaymentMethodDto;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="rounded-2xl border border-border glass p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{paymentMethodSummary(method)}</p>
            {method.isDefault ? (
              <span className="rounded-full bg-gradient-accent-soft px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground">
                Predeterminado
              </span>
            ) : null}
          </div>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-foreground-subtle">
            {formatPaymentMethod(method)}
          </pre>
        </div>
        <div className="flex flex-wrap gap-2">
          {!method.isDefault ? (
            <button
              type="button"
              onClick={() => onSetDefault(method.id)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground-subtle hover:text-foreground"
            >
              Predeterminar
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onRemove(method.id)}
            className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:border-red-500/50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}

export function PaymentMethodsManager({
  initialMethods,
}: {
  initialMethods: PaymentMethodDto[];
}) {
  const [methods, setMethods] = useState(initialMethods);
  const [form, setForm] = useState<PaymentMethodFormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { bankAccounts, brebKeys } = useMemo(
    () => partitionPaymentMethods(methods),
    [methods],
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload =
      form.type === "BANK_ACCOUNT"
        ? {
            type: "BANK_ACCOUNT" as const,
            bankName: form.bankName,
            accountType: form.accountType,
            accountNumber: form.accountNumber,
            holderName: form.holderName || undefined,
            isDefault: form.isDefault,
          }
        : {
            type: "BREB" as const,
            brebKey: form.brebKey,
            holderName: form.holderName || undefined,
            isDefault: form.isDefault,
          };

    const res = await fetch("/api/v1/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Error al guardar el método de pago");
      return;
    }

    setMethods((prev) => {
      const next = data.isDefault
        ? prev.map((item) => ({ ...item, isDefault: false }))
        : prev;
      return [...next, data];
    });
    setForm(emptyForm());
  }

  async function setDefault(id: string) {
    const res = await fetch(`/api/v1/payment-methods/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setMethods((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === data.id,
      })),
    );
  }

  async function remove(id: string) {
    const res = await fetch(`/api/v1/payment-methods/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setMethods((prev) => prev.filter((item) => item.id !== id));
  }

  function renderSavedGroup(title: string, items: PaymentMethodDto[]) {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted">{title}</h3>
        <ul className="space-y-3">
          {items.map((method) => (
            <SavedMethodCard
              key={method.id}
              method={method}
              onSetDefault={setDefault}
              onRemove={remove}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreate}
        className="max-w-2xl space-y-5 rounded-3xl border border-border glass p-6 sm:p-8"
      >
        <div>
          <h2 className="font-display text-lg font-semibold">Agregar método de pago</h2>
          <p className="mt-1 text-sm text-muted">
            Configura cuentas bancarias o llaves Bre-B para usarlas al crear cuentas de cobro.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["BANK_ACCOUNT", "BREB"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, type }))}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                form.type === type
                  ? "bg-gradient-accent text-white"
                  : "border border-border text-foreground-subtle hover:text-foreground"
              }`}
            >
              {type === "BANK_ACCOUNT" ? "Cuenta bancaria" : "Llave Bre-B"}
            </button>
          ))}
        </div>

        {form.type === "BANK_ACCOUNT" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-muted">Banco *</span>
              <input
                value={form.bankName}
                onChange={(e) => setForm((prev) => ({ ...prev, bankName: e.target.value }))}
                required
                placeholder="Bancolombia, Nequi, Davivienda…"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted">Tipo de cuenta *</span>
              <select
                value={form.accountType}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    accountType: e.target.value as "SAVINGS" | "CHECKING",
                  }))
                }
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
              >
                <option value="SAVINGS">Ahorros</option>
                <option value="CHECKING">Corriente</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted">Número de cuenta *</span>
              <input
                value={form.accountNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
                required
                placeholder="1234567890"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
              />
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">Llave Bre-B *</span>
            <input
              value={form.brebKey}
              onChange={(e) => setForm((prev) => ({ ...prev, brebKey: e.target.value }))}
              required
              placeholder="@usuario, celular, correo o NIT"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Titular (opcional)</span>
          <input
            value={form.holderName}
            onChange={(e) => setForm((prev) => ({ ...prev, holderName: e.target.value }))}
            placeholder="Nombre del titular"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-foreground-subtle">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
            className="rounded border-border"
          />
          Usar como método predeterminado
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
          {loading ? "Guardando…" : "Guardar método"}
        </button>
      </form>

      <section className="space-y-6">
        <h2 className="font-display text-lg font-semibold">Métodos guardados</h2>
        {methods.length === 0 ? (
          <p className="rounded-2xl border border-border glass p-6 text-sm text-muted">
            Aún no tienes métodos de pago. Agrega uno arriba para incluirlo automáticamente en
            tus cuentas de cobro.
          </p>
        ) : (
          <div className="space-y-8">
            {renderSavedGroup("Cuenta bancaria", bankAccounts)}
            {renderSavedGroup("Llave Bre-B", brebKeys)}
          </div>
        )}
      </section>
    </div>
  );
}
