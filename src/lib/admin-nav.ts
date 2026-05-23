export type AdminNavItem = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
};

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Cuentas de cobro",
    match: (pathname) =>
      pathname === "/admin" ||
      (pathname.startsWith("/admin/invoices/") && pathname !== "/admin/invoices/new"),
  },
  {
    href: "/admin/invoices/new",
    label: "Nueva cuenta",
    match: (pathname) => pathname === "/admin/invoices/new",
  },
  {
    href: "/admin/payment-methods",
    label: "Métodos de pago",
    match: (pathname) => pathname.startsWith("/admin/payment-methods"),
  },
  {
    href: "/admin/api-keys",
    label: "API Keys",
    match: (pathname) => pathname.startsWith("/admin/api-keys"),
  },
];

export function adminNavLinkClass(active: boolean): string {
  return active
    ? "text-sm font-medium text-gradient"
    : "text-sm text-foreground-subtle transition-colors hover:text-foreground";
}

export function adminNavMobileLinkClass(active: boolean): string {
  return active
    ? "block rounded-lg bg-surface-elevated px-3 py-2.5 text-sm font-medium text-foreground"
    : "block rounded-lg px-3 py-2.5 text-sm text-foreground-subtle hover:bg-surface-elevated hover:text-foreground";
}
