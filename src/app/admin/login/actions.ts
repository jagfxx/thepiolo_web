"use server";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const callbackUrl = formData.get("callbackUrl")?.toString() || "/admin";

  if (!email || !password) {
    redirect(
      `/admin/login?error=missing&callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthError) {
      redirect(
        `/admin/login?error=credentials&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    }

    console.error("[login] unexpected error:", error);
    redirect(
      `/admin/login?error=server&callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }
}
