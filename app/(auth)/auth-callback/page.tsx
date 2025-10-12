import { Suspense } from "react";
import AuthCallback from "./auth-callback";
import Loader from "@/components/ui/loader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Callback",
  description: "Redirecting you to your destination!",
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthCallback />
    </Suspense>
  );
}
