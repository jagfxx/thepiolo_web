import { AdminShell } from "@/components/admin/AdminShell";
import { PaymentMethodsManager } from "@/components/admin/PaymentMethodsManager";
import { auth } from "@/lib/auth";
import { listPaymentMethods } from "@/lib/billing/payment-methods";
import { redirect } from "next/navigation";

export default async function PaymentMethodsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const methods = await listPaymentMethods(session.user.id);

  return (
    <AdminShell title="Métodos de pago">
      <PaymentMethodsManager initialMethods={methods} />
    </AdminShell>
  );
}
