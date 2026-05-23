"use client";

import { loginAction } from "@/app/admin/login/actions";

const errorMessages: Record<string, string> = {
  credentials:
    "Credenciales incorrectas. Verifica email/contraseña y ejecuta: npm run db:seed",
  missing: "Correo y contraseña son obligatorios.",
  server: "Error del servidor. Revisa logs de PM2 y variables AUTH_SECRET / DATABASE_URL.",
};

export function LoginForm({
  callbackUrl,
  errorCode,
}: {
  callbackUrl: string;
  errorCode?: string;
}) {
  const error = errorCode ? errorMessages[errorCode] ?? "No se pudo iniciar sesión." : null;

  return (
    <form
      action={loginAction}
      className="w-full max-w-md space-y-5 rounded-3xl border border-border glass p-8"
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <p className="text-center text-sm text-muted">Panel de cuentas de cobro</p>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Correo</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
        />
      </label>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-full bg-gradient-accent py-3 text-sm font-medium text-white transition-all hover:brightness-110"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
