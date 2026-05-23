"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-md space-y-5 rounded-3xl border border-border glass p-8"
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold text-gradient">THEPIOLO</h1>
        <p className="mt-2 text-sm text-muted">Panel de cuentas de cobro</p>
      </div>

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

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gradient-accent py-3 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
