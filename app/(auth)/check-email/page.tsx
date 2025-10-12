"use client";

import { FaRotateLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) return router.replace("/auth");

  return (
    <div className="h-screen grid place-items-center bg-linear-110 from-primary/25 via-background to-accent/25 p-4">
      <div className="container-md text-center flex flex-col shadow-2xl p-6 rounded-lg bg-secondary">
        <h2>Check your email</h2>
        <p className="my-2 text-sm text-center">
          We sent a magic sign-in link to <strong>{email}</strong>.
        </p>
        <p className="text-sm text-center">
          Didn&apos;t receive it? Check your spam folder or try again.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button
            className="hover:[&_svg]:-rotate-360"
            variant="primary"
            onClick={() =>
              router.replace(`/auth?email=${encodeURIComponent(email)}`)
            }
          >
            <FaRotateLeft className="transition-transform duration-500" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
