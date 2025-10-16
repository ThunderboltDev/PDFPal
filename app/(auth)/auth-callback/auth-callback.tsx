"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import Loader from "@/components/ui/loader";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") ?? searchParams.get("callbackUrl");

  const { isSuccess, isError } = trpc.auth.authCallback.useQuery(undefined, {
    retry: 3,
  });

  useEffect(() => {
    if (isSuccess) {
      router.replace(origin ? origin : "/dashboard");
    }
  }, [isSuccess, origin, router]);

  useEffect(() => {
    if (isError) {
      router.replace(`/auth?callbackUrl=${origin}&utm_source=${origin}`);
    }
  }, [isError, origin, router]);

  return <Loader />;
}
