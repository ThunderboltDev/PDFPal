import { Suspense } from "react";
import AuthCallback from "./auth-callback";
import Loader from "@/components/ui/loader";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthCallback />
    </Suspense>
  );
}
