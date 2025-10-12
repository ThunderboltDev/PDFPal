"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/ui/loader";
import { trpc } from "@/app/_trpc/client";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") ?? searchParams.get("callbackUrl");

  const { error, isSuccess, isError } = trpc.auth.authCallback.useQuery(
    undefined,
    {
      retry: 3,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      router.replace(origin ? origin : "/dashboard");
    }
  }, [isSuccess, origin, router]);

  useEffect(() => {
    if (isError && error) {
      const code = error?.data?.code ?? null;
      if (code === "UNAUTHORIZED") {
        router.replace(`/auth?callbackUrl=${origin}`);
      } else {
        console.error("authCallback error", error);
      }
    }
  }, [isError, error, origin, router]);

  return <Loader />;
}
