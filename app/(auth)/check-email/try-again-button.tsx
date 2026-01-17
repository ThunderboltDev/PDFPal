"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";
import { FaRotateLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export default function TryAgainButton({ email }: { email: string }) {
  const router = useRouter();

  return (
    <Button
      className="hover:[&_svg]:-rotate-360"
      onClick={() => {
        sendGTMEvent({
          event: "auth",
          action: "retry_email_verification",
          value: 1,
        });

        router.replace(`/auth?email=${encodeURIComponent(email)}`);
      }}
      variant="primary"
    >
      <FaRotateLeft className="transition-transform duration-500" />
      Try Again
    </Button>
  );
}
