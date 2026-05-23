"use client";

import { useState } from "react";
import { siteConfig, whatsappUrl } from "@/lib/site";

type SharePdfButtonProps = {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string | null;
};

export function SharePdfButton({
  invoiceId,
  invoiceNumber,
  clientName,
  clientEmail,
}: SharePdfButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pdfUrl = `/api/v1/invoices/${invoiceId}/pdf`;
  const shareText = `Cuenta de cobro ${invoiceNumber} — ${clientName}`;

  async function fetchPdfFile(): Promise<File> {
    const res = await fetch(pdfUrl);
    if (!res.ok) throw new Error("No se pudo obtener el PDF");
    const blob = await res.blob();
    return new File([blob], `${invoiceNumber}.pdf`, { type: "application/pdf" });
  }

  async function handleShare() {
    setError(null);
    setLoading(true);
    try {
      const file = await fetchPdfFile();

      if (typeof navigator !== "undefined" && navigator.share) {
        const canShareFiles =
          !navigator.canShare || navigator.canShare({ files: [file] });

        if (canShareFiles) {
          try {
            await navigator.share({
              files: [file],
              title: shareText,
              text: shareText,
            });
            return;
          } catch (err) {
            if ((err as Error).name === "AbortError") return;
          }
        }
      }

      setOpen(true);
    } catch {
      setError("Error al preparar el PDF");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    const file = await fetchPdfFile();
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  const mailTo = `mailto:${clientEmail || siteConfig.email}?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\nAdjunta el PDF descargado desde el panel de THEPIOLO.`)}`;

  const whatsappShare = whatsappUrl(
    `${shareText}. Te comparto la cuenta de cobro en PDF.`,
  );

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="rounded-full border border-border px-5 py-2 text-sm text-foreground-subtle transition-colors hover:border-border-hover hover:text-foreground disabled:opacity-60"
      >
        {loading ? "Preparando…" : "Enviar PDF"}
      </button>

      {error ? <p className="w-full text-xs text-red-300">{error}</p> : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border glass p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 font-display text-base font-semibold">Enviar cuenta de cobro</p>
            <ul className="space-y-2">
              <li>
                <a
                  href={whatsappShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-border bg-surface px-4 py-3 text-sm hover:bg-surface-elevated"
                  onClick={() => setOpen(false)}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={mailTo}
                  className="block rounded-xl border border-border bg-surface px-4 py-3 text-sm hover:bg-surface-elevated"
                  onClick={() => setOpen(false)}
                >
                  Gmail / Correo
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="block w-full rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm hover:bg-surface-elevated"
                >
                  Descargar PDF
                </button>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-full border border-border py-2 text-sm text-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
