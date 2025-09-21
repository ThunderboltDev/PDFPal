"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trpc } from "../_trpc/client";
import Loader from "@/components/ui/loader";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { error, isSuccess, isError } = trpc.auth.authCallback.useQuery(
    undefined,
    {
      retry: false,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      router.replace(origin ? `/${origin}` : "/dashboard");
    }
  }, [isSuccess, origin, router]);

  useEffect(() => {
    if (isError && error) {
      const code = error?.data?.code ?? null;
      if (code === "UNAUTHORIZED") {
        router.replace("/sign-in");
      } else {
        console.error("authCallback error", error);
      }
    }
  }, [isError, error, router]);

  return <Loader />;
}
