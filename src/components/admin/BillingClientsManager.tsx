"use client";

import { useState } from "react";
import type { ClientIdType } from "@prisma/client";
import { ClientIdFields } from "@/components/admin/LineItemsEditor";
import type { BillingClientDto } from "@/lib/billing/clients";
import { formatClientIdLabel } from "@/lib/billing/clients";

type ClientFormState = {
  name: string;
  idType: ClientIdType | "";
  idNumber: string;
  email: string;
};

const emptyForm = (): ClientFormState => ({
  name: "",
  idType: "",
  idNumber: "",
  email: "",
});

export function BillingClientsManager({
  initialClients,
}: {
  initialClients: BillingClientDto[];
}) {
  const [clients, setClients] = useState(initialClients);
  const [form, setForm] = useState<ClientFormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (form.idNumber && !form.idType) {
      setError("Selecciona NIT o CC");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          idType: form.idType || undefined,
          idNumber: form.idNumber || undefined,
          email: form.email || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al guardar cliente");
        return;
      }
      setClients([data, ...clients].sort((a, b) => a.name.localeCompare(b.name)));
      setForm(emptyForm());
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function removeClient(id: string) {
    if (!confirm("¿Eliminar este cliente?")) return;
    const res = await fetch(`/api/v1/clients/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setClients(clients.filter((client) => client.id !== id));
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 rounded-3xl border border-border glass p-6 sm:p-8"
      >
        <h2 className="text-lg font-medium text-foreground">Nuevo cliente</h2>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Nombre *</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          />
        </label>

        <ClientIdFields
          idType={form.idType}
          idNumber={form.idNumber}
          onIdTypeChange={(idType) => setForm({ ...form, idType })}
          onIdNumberChange={(idNumber) => setForm({ ...form, idNumber })}
        />

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Correo</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gradient-accent px-6 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Agregar cliente"}
        </button>
      </form>

      {clients.length === 0 ? (
        <p className="text-sm text-muted">Aún no hay clientes guardados.</p>
      ) : (
        <ul className="space-y-3">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border glass p-5"
            >
              <div>
                <p className="font-medium text-foreground">{client.name}</p>
                {formatClientIdLabel(client.idType, client.idNumber) ? (
                  <p className="mt-1 text-sm text-muted">
                    {formatClientIdLabel(client.idType, client.idNumber)}
                  </p>
                ) : null}
                {client.email ? (
                  <p className="mt-1 text-sm text-foreground-subtle">{client.email}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeClient(client.id)}
                className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:border-red-500/50"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
