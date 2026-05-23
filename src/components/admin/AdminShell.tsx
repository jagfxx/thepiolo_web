import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { auth } from "@/lib/auth";

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
      <AdminNavbar email={session?.user?.email} />
      <main className="mx-auto max-w-6xl px-5 pb-10 pt-28 sm:px-8 sm:pt-32">
        <h1 className="mb-8 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}
