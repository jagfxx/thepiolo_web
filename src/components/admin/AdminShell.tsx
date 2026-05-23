import Link from "next/link";
import { BrandLogo } from "@/components/admin/BrandLogo";
import { auth, signOut } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Cuentas de cobro" },
  { href: "/admin/invoices/new", label: "Nueva cuenta" },
  { href: "/admin/api-keys", label: "API Keys" },
];

export async function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border glass">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-1">
            <BrandLogo variant="full" size="sm" href="/admin" subtitle="Admin" priority />
            <p className="text-xs text-muted">{session?.user?.email}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Sitio
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground-subtle transition-colors hover:border-border-hover hover:text-foreground"
              >
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <h1 className="mb-8 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}
