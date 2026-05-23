"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { InvoiceStatus } from "@prisma/client";
import { SharePdfButton } from "@/components/admin/SharePdfButton";
import { statusLabels } from "@/lib/billing/brand";

const editableStatuses: InvoiceStatus[] = ["ISSUED", "PAID", "CANCELLED"];

export function InvoiceDetailActions({
  invoiceId,
  invoiceNumber,
  clientName,
  clientEmail,
  currentStatus,
}: {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string | null;
  currentStatus: InvoiceStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<InvoiceStatus>(
    currentStatus === "DRAFT" ? "ISSUED" : currentStatus,
  );
  const [loading, setLoading] = useState(false);

  const isDraft = currentStatus === "DRAFT";

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
      {!isDraft ? (
        <>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none"
          >
            {editableStatuses.map((value) => (
              <option key={value} value={value}>
                {statusLabels[value]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={updateStatus}
            disabled={loading || status === currentStatus}
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-elevated disabled:opacity-60"
          >
            Actualizar estado
          </button>
        </>
      ) : null}

      <SharePdfButton
        invoiceId={invoiceId}
        invoiceNumber={invoiceNumber}
        clientName={clientName}
        clientEmail={clientEmail}
      />

      <a
        href={`/api/v1/invoices/${invoiceId}/pdf`}
        className="rounded-full bg-gradient-accent px-5 py-2 text-sm font-medium text-white hover:brightness-110"
      >
        Descargar PDF
      </a>
    </div>
  );
}
