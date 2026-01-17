import { NextResponse } from "next/server";
import { url } from "@/config";

const AUTH_ROUTES = ["/auth", "/check-email"] as readonly string[];

const PRIVATE_ROUTES = [
  "/dashboard",
  "/account",
  "/billing",
] as readonly string[];

export default async function proxy(req: Request) {
  const { pathname } = new URL(req.url);

  const response = await fetch(`${url}/api/auth/get-session`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  const session = await response.json();

  const isAuthenticated = !!(
    session &&
    Object.hasOwn(session, "user") &&
    session.user
  );

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAuthenticated && isPrivateRoute) {
    const redirectUrl = new URL("/auth", req.url);
    redirectUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthenticated && isAuthRoute) {
    const callbackUrl =
      new URL(req.url).searchParams.get("callbackUrl") || "/dashboard";
    return NextResponse.redirect(new URL(callbackUrl, req.url));
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
