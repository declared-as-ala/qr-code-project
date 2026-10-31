import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse, type NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const authHandler = auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  if ((path === "/" || path === "/login") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export function proxy(req: NextRequest, ctx: unknown) {
  // Avoid setting NextAuth CSRF/callback cookies on anonymous visits to "/" and "/login"
  // so public pages remain clean for search crawlers and CDN caching.
  const hasSessionCookie =
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("authjs.session-token");

  if (!hasSessionCookie) {
    return NextResponse.next();
  }

  return (authHandler as (req: NextRequest, ctx: unknown) => ReturnType<typeof NextResponse.next>)(
    req,
    ctx
  );
}

export const config = {
  matcher: ["/", "/login"],
};

