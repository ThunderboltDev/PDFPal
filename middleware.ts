import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const AUTH_ROUTES = ["/auth", "/auth-callback", "/check-email"];

const PUBLIC_ROUTES = [
  "/",
  "/faq",
  "/logout",
  "/contact",
  "/pricing",
  "/cookie-policy",
  "/privacy-policy",
  "/terms-of-service",
];

export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl;
  const isAuthenticated = !!req.auth?.user;

  if (!isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    const callbackUrl = searchParams.get("callbackUrl");

    if (!callbackUrl || AUTH_ROUTES.includes(callbackUrl)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL(callbackUrl!, req.url));
    }
  }

  if (isAuthenticated) {
    const res = NextResponse.next();

    const userAgent = req.headers.get("user-agent") || "Unknown User Agent";
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip")?.split(",")[0] ??
      req.headers.get("cf-connecting-ip")?.split(",")[0] ??
      "Unknown IP";

    res.cookies.set("client-ip", ip, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    res.cookies.set("client-ua", userAgent, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  }

  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image")
  ) {
    return NextResponse.next();
  }

  const redirectUrl = new URL("/auth", req.url);
  redirectUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(redirectUrl);
});

export const runtime = "nodejs";

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
};
