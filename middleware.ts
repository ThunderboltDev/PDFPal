import { NextResponse } from "next/server";

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

const authCookieRegex = /(authjs.csrf-token|authjs.session-token=)/;

export default function middleware(req: Request & { nextUrl: URL }) {
  const { pathname, searchParams } = req.nextUrl;

  const cookieHeader = req.headers.get("cookie") || "";
  const isAuthenticated = authCookieRegex.test(cookieHeader);

  if (!isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    const callbackUrl = searchParams.get("callbackUrl");

    if (!callbackUrl || AUTH_ROUTES.includes(callbackUrl)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.redirect(new URL(callbackUrl, req.url));
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
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
};
