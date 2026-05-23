"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { InvoiceStatus } from "@prisma/client";

export function InvoiceDetailActions({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    setLoading(true);
    const res = await fetch(`/api/v1/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
        className="rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none"
      >
        <option value="DRAFT">Borrador</option>
        <option value="ISSUED">Emitida</option>
        <option value="PAID">Pagada</option>
        <option value="CANCELLED">Anulada</option>
      </select>
      <button
        type="button"
        onClick={updateStatus}
        disabled={loading}
        className="rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-elevated disabled:opacity-60"
      >
        Actualizar estado
      </button>
      <a
        href={`/api/v1/invoices/${invoiceId}/pdf`}
        className="rounded-full bg-gradient-accent px-5 py-2 text-sm font-medium text-white hover:brightness-110"
      >
        Descargar PDF
      </a>
    </div>
  );
}
