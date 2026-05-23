import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      const token = await getToken({
        req: request,
        secret: authSecret,
      });
      if (token) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: authSecret,
    });
    if (!token) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/v1")) {
    const hasBearer = request.headers.get("authorization")?.startsWith("Bearer ");
    if (hasBearer) return NextResponse.next();

    const token = await getToken({
      req: request,
      secret: authSecret,
    });
    if (token) return NextResponse.next();

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/v1/:path*"],
};
