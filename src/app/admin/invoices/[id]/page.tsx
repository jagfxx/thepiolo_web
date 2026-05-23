export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { InvoiceDetailActions } from "@/components/admin/InvoiceDetailActions";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { statusLabels } from "@/lib/billing/brand";
import { formatClientIdLabel } from "@/lib/billing/clients";
import { formatCop, getInvoiceById } from "@/lib/billing/invoices";
import { listBillingClients } from "@/lib/billing/clients";
import { listPaymentMethods } from "@/lib/billing/payment-methods";
import { auth } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const isDraft = invoice.status === "DRAFT";

  const [paymentMethods, clients] =
    session?.user?.id && isDraft
      ? await Promise.all([
          listPaymentMethods(session.user.id),
          listBillingClients(session.user.id),
        ])
      : [[], []];

  const idLabel = formatClientIdLabel(invoice.clientIdType, invoice.clientId);

  return (
    <AdminShell title={invoice.number}>
      <div className="max-w-2xl space-y-6">
        <InvoiceDetailActions
          invoiceId={invoice.id}
          invoiceNumber={invoice.number}
          clientName={invoice.clientName}
          clientEmail={invoice.clientEmail}
          currentStatus={invoice.status}
        />

        {isDraft ? (
          <InvoiceForm paymentMethods={paymentMethods} clients={clients} invoice={invoice} />
        ) : (
          <div className="rounded-3xl border border-border glass p-6 sm:p-8">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">Cliente</dt>
                <dd className="mt-1 font-medium">{invoice.clientName}</dd>
              </div>
              {idLabel ? (
                <div>
                  <dt className="text-xs text-muted">Identificación</dt>
                  <dd className="mt-1">{idLabel}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs text-muted">Monto total</dt>
                <dd className="mt-1 text-lg font-semibold text-gradient">
                  {formatCop(invoice.amount, invoice.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Estado</dt>
                <dd className="mt-1">{statusLabels[invoice.status] ?? invoice.status}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Fecha de emisión</dt>
                <dd className="mt-1">
                  {new Date(invoice.issuedAt).toLocaleDateString("es-CO")}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted">Conceptos</dt>
                <dd className="mt-2 space-y-2">
                  {invoice.lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-surface/40 px-3 py-2"
                    >
                      <span className="text-foreground-subtle">{item.concept}</span>
                      <span className="shrink-0 font-medium">
                        {formatCop(item.amount, invoice.currency)}
                      </span>
                    </div>
                  ))}
                </dd>
              </div>
              {invoice.paymentInstructions ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted">Pago</dt>
                  <dd className="mt-1 whitespace-pre-line text-foreground-subtle">
                    {invoice.paymentInstructions}
                  </dd>
                </div>
              ) : null}
              {invoice.notes ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted">Notas</dt>
                  <dd className="mt-1 text-foreground-subtle">{invoice.notes}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
