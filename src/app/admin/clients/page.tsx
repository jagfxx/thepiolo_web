import { AdminShell } from "@/components/admin/AdminShell";
import { BillingClientsManager } from "@/components/admin/BillingClientsManager";
import { auth } from "@/lib/auth";
import { listBillingClients } from "@/lib/billing/clients";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const clients = await listBillingClients(session.user.id);

  return (
    <AdminShell title="Clientes">
      <BillingClientsManager initialClients={clients} />
    </AdminShell>
  );
}
