import { LoginForm } from "@/components/admin/LoginForm";

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <LoginForm callbackUrl={callbackUrl} errorCode={params.error} />
    </div>
  );
}
