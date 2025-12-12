import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/auth", "/check-email"] as readonly string[];

const PRIVATE_ROUTES = [
  "/dashboard",
  "/account",
  "/billing",
] as readonly string[];

const sessionCookieRegex = /(?:^|;\s*)(?:__Secure-)?authjs\.session-token=/;

export default async function proxy(req: Request & { nextUrl: URL }) {
  const { pathname, searchParams, origin } = req.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image")
  ) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get("cookie") ?? "";
  const isAuthenticated = sessionCookieRegex.test(cookieHeader);

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAuthenticated && isPrivateRoute) {
    const redirectUrl = new URL("/auth", req.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthenticated && isAuthRoute) {
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    return NextResponse.redirect(new URL(callbackUrl, origin));
  }

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

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
};
