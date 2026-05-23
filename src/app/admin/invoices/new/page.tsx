import { AdminShell } from "@/components/admin/AdminShell";
import { InvoiceForm } from "@/components/admin/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <AdminShell title="Nueva cuenta de cobro">
      <InvoiceForm />
    </AdminShell>
  );
}
