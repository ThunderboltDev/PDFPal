import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(async function middleware() {}, {
  isReturnToCurrentPage: true,
  loginPage: "/login",
  publicPaths: ["/public", "/more"],
});

export const config = {
  matcher: ["/dashboard/:path*", "/billing", "/auth-callback"],
};
