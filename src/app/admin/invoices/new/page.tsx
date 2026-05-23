import { AdminShell } from "@/components/admin/AdminShell";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { auth } from "@/lib/auth";
import { listBillingClients } from "@/lib/billing/clients";
import { listPaymentMethods } from "@/lib/billing/payment-methods";
import { redirect } from "next/navigation";

export default async function NewInvoicePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const [paymentMethods, clients] = await Promise.all([
    listPaymentMethods(session.user.id),
    listBillingClients(session.user.id),
  ]);

  return (
    <AdminShell title="Nueva cuenta de cobro">
      <InvoiceForm paymentMethods={paymentMethods} clients={clients} />
    </AdminShell>
  );
}
