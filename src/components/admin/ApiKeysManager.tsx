"use client";

import { useState } from "react";

type ApiKeyItem = {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export function ApiKeysManager({ initialKeys }: { initialKeys: ApiKeyItem[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createKey(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNewKey(null);

    const res = await fetch("/api/v1/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Error al crear API key");
      return;
    }

    setNewKey(data.rawKey);
    setName("");
    setKeys((prev) => [
      {
        id: data.id,
        name: data.name,
        prefix: data.prefix,
        lastUsedAt: null,
        revokedAt: null,
        createdAt: data.createdAt,
      },
      ...prev,
    ]);
  }

  async function revoke(id: string) {
    const res = await fetch(`/api/v1/api-keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      setKeys((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, revokedAt: new Date().toISOString() } : k,
        ),
      );
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={createKey}
        className="flex max-w-lg flex-col gap-3 rounded-2xl border border-border glass p-6 sm:flex-row sm:items-end"
      >
        <label className="flex-1">
          <span className="mb-1.5 block text-xs font-medium text-muted">Nombre de la key</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Postman, script facturación"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gradient-accent px-6 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60"
        >
          Generar key
        </button>
      </form>

      {newKey && (
        <div className="rounded-2xl border border-[#b440ff]/40 bg-[#b440ff]/10 p-4">
          <p className="text-sm font-medium text-foreground">Copia tu API key ahora:</p>
          <code className="mt-2 block break-all rounded-lg bg-background px-3 py-2 text-xs text-foreground">
            {newKey}
          </code>
          <p className="mt-2 text-xs text-muted">
            Header: <code>Authorization: Bearer &lt;key&gt;</code>
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}

      <ul className="space-y-3">
        {keys.map((key) => (
          <li
            key={key.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
          >
            <div>
              <p className="font-medium text-foreground">{key.name}</p>
              <p className="font-mono text-xs text-muted">{key.prefix}…</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs ${key.revokedAt ? "text-red-300" : "text-emerald-400"}`}
              >
                {key.revokedAt ? "Revocada" : "Activa"}
              </span>
              {!key.revokedAt && (
                <button
                  type="button"
                  onClick={() => revoke(key.id)}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Revocar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
