"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { Loader2, ReceiptText, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  className?: string;
  isSubscribed: boolean;
}

export function UpgradeButton({
  isSubscribed,
  className = "",
}: UpgradeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBillingPortal = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.dodopayments.customer.portal({});

      if (data) {
        router.push(data.url);
      } else {
        toast.error("Failed to cancel subscription");
        console.error(error);
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    if (isSubscribed) {
      handleBillingPortal();
    } else {
      sendGTMEvent({
        value: 1,
        event: "subscription_action",
        action: "pricing_click",
        button_name: "Upgrade to Pro",
      });

      router.push(
        "/pricing?utm_source=app&utm_medium=button&utm_campaign=upgrade-button#billing-period-toggle"
      );
    }
  };

  return (
    <Button
      aria-busy={isLoading}
      className={cn("group", className)}
      disabled={isLoading}
      onClick={handleClick}
      variant="primary"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Redirecting...
        </>
      ) : isSubscribed ? (
        <>
          <ReceiptText className="group-hover:-skew-3 group-hover:scale-110 transition-all duration-300" />
          Manage Subscription
        </>
      ) : (
        <>
          <Zap className="fill-white/25 transition-all duration-300 group-hover:rotate-10 group-hover:scale-125" />
          Upgrade to Pro
        </>
      )}
    </Button>
  );
}
