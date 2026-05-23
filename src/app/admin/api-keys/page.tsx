export const dynamic = "force-dynamic";

import { AdminShell } from "@/components/admin/AdminShell";
import { ApiKeysManager } from "@/components/admin/ApiKeysManager";
import { auth } from "@/lib/auth";
import { listApiKeys } from "@/lib/billing/api-keys";
import { redirect } from "next/navigation";

export default async function ApiKeysPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const keys = await listApiKeys(session.user.id);

  return (
    <AdminShell title="API Keys">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Usa estas claves para llamar la API desde Postman o scripts. Ejemplo:{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-xs">
          POST /api/v1/invoices
        </code>
      </p>
      <ApiKeysManager initialKeys={keys} />
    </AdminShell>
  );
}
