"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const callbackUrl = formData.get("callbackUrl")?.toString() || "/admin";

  if (!email || !password) {
    return { error: "Correo y contraseña son obligatorios." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          error:
            "Credenciales incorrectas. Verifica ADMIN_EMAIL / ADMIN_PASSWORD y ejecuta: npm run db:seed",
        };
      }
    }
    throw error;
  }

  return {};
}
