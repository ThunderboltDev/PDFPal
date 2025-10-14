import type { Metadata } from "next";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";
import AuthCallback from "./auth-callback";

export const metadata: Metadata = {
  title: "Redirecting...",
  description:
    "Verifying your PDF Pal account. You will be redirected shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthCallback />
    </Suspense>
  );
}
