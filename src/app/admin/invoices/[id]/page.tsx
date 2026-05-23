export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { InvoiceDetailActions } from "@/components/admin/InvoiceDetailActions";
import { formatCop, getInvoiceById } from "@/lib/billing/invoices";

type Props = { params: Promise<{ id: string }> };

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  return (
    <AdminShell title={invoice.number}>
      <div className="max-w-2xl space-y-6 rounded-3xl border border-border glass p-6 sm:p-8">
        <InvoiceDetailActions invoiceId={invoice.id} currentStatus={invoice.status} />

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Cliente</dt>
            <dd className="mt-1 font-medium">{invoice.clientName}</dd>
          </div>
          {invoice.clientId && (
            <div>
              <dt className="text-xs text-muted">Identificación</dt>
              <dd className="mt-1">{invoice.clientId}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-muted">Monto</dt>
            <dd className="mt-1 text-lg font-semibold text-gradient">
              {formatCop(invoice.amount, invoice.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Estado</dt>
            <dd className="mt-1">{invoice.status}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted">Concepto</dt>
            <dd className="mt-1 leading-relaxed text-foreground-subtle">{invoice.concept}</dd>
          </div>
          {invoice.paymentInstructions && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted">Pago</dt>
              <dd className="mt-1 whitespace-pre-line text-foreground-subtle">
                {invoice.paymentInstructions}
              </dd>
            </div>
          )}
          {invoice.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted">Notas</dt>
              <dd className="mt-1 text-foreground-subtle">{invoice.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    </AdminShell>
  );
}
