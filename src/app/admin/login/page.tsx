import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <Suspense fallback={<div className="text-muted">Cargando…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
