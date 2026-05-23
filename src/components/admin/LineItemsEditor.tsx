"use client";

import { useMemo } from "react";
import type { ClientIdType } from "@prisma/client";
import { AmountInput } from "@/components/admin/AmountInput";
import { digitsOnly } from "@/lib/billing/format-currency";
import { formatCop } from "@/lib/billing/invoices";

export type LineItemDraft = {
  key: string;
  concept: string;
  amount: number;
};

function newLineItem(): LineItemDraft {
  return {
    key: crypto.randomUUID(),
    concept: "",
    amount: 0,
  };
}

export function createInitialLineItems(
  items?: { concept: string; amount: number }[],
): LineItemDraft[] {
  if (items && items.length > 0) {
    return items.map((item) => ({
      key: crypto.randomUUID(),
      concept: item.concept,
      amount: item.amount,
    }));
  }
  return [newLineItem()];
}

type LineItemsEditorProps = {
  items: LineItemDraft[];
  onChange: (items: LineItemDraft[]) => void;
};

export function LineItemsEditor({ items, onChange }: LineItemsEditorProps) {
  const total = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

  function updateItem(key: string, patch: Partial<LineItemDraft>) {
    onChange(items.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([...items, newLineItem()]);
  }

  function removeItem(key: string) {
    if (items.length <= 1) return;
    onChange(items.filter((item) => item.key !== key));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted">Conceptos *</span>
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-border px-3 py-1 text-xs text-foreground-subtle hover:text-foreground"
        >
          + Agregar concepto
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.key}
            className="grid gap-3 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[1fr_140px_auto]"
          >
            <label className="block">
              <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
                Concepto {items.length > 1 ? index + 1 : ""}
              </span>
              <input
                required
                value={item.concept}
                onChange={(e) => updateItem(item.key, { concept: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-elevated/50 px-3 py-2 text-sm outline-none focus:border-border-hover"
                placeholder="Descripción del servicio"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">
                Valor (COP)
              </span>
              <AmountInput
                required
                value={item.amount}
                onChange={(amount) => updateItem(item.key, { amount })}
                className="w-full rounded-lg border border-border bg-surface-elevated/50 px-3 py-2 text-sm outline-none focus:border-border-hover"
              />
            </label>
            <div className="flex items-end pb-0.5">
              {items.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:border-red-500/50"
                  aria-label="Eliminar concepto"
                >
                  Quitar
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-right text-sm text-muted">
        Total: <span className="font-semibold text-foreground">{formatCop(total)}</span>
      </p>
    </div>
  );
}

type ClientIdFieldsProps = {
  idType: ClientIdType | "";
  idNumber: string;
  onIdTypeChange: (value: ClientIdType | "") => void;
  onIdNumberChange: (value: string) => void;
};

export function ClientIdFields({
  idType,
  idNumber,
  onIdTypeChange,
  onIdNumberChange,
}: ClientIdFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Tipo ID</span>
        <select
          value={idType}
          onChange={(e) => onIdTypeChange(e.target.value as ClientIdType | "")}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
        >
          <option value="">—</option>
          <option value="NIT">NIT</option>
          <option value="CC">CC</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">
          {idType === "NIT" ? "NIT" : idType === "CC" ? "Cédula" : "Número"}
        </span>
        <input
          value={idNumber}
          onChange={(e) => onIdNumberChange(digitsOnly(e.target.value))}
          inputMode="numeric"
          pattern="\d*"
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          placeholder={idType ? "Solo números" : "Opcional"}
        />
      </label>
    </div>
  );
}
