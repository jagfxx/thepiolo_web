import { BrandLogo } from "@/components/admin/BrandLogo";
import { LoginForm } from "@/components/admin/LoginForm";

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/admin";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16">
      <BrandLogo
        variant="full"
        size="hero"
        subtitle="Graphic Design"
        className="mb-10"
        priority
      />
      <LoginForm callbackUrl={callbackUrl} errorCode={params.error} />
    </div>
  );
}
