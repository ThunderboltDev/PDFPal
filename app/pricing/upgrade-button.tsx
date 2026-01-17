"use client";

import { Loader2, ReceiptText, Zap } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  className?: string;
  billingCycle?: "monthly" | "yearly";
  isSubscribed: boolean;
  userId: string | null;
}

export function UpgradeButton({
  isSubscribed,
  billingCycle = "monthly",
  className = "",
  userId,
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (slug: "pro-monthly" | "pro-yearly") => {
    if (!userId) return;

    setIsLoading(true);

    try {
      const { data, error } = await authClient.dodopayments.checkoutSession({
        slug,
        referenceId: userId,
        product_cart: [
          {
            quantity: 1,
            product_id: config.plans.pro.productId[billingCycle],
          },
        ],
      });
      if (data) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
        console.error("Checkout error:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.dodopayments.customer.portal();
      if (data) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
        console.error("Checkout error:", error);
      }
    } catch (error) {
      console.error("Error accessing portal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    if (isSubscribed && userId) handleBillingPortal();
    else
      handleCheckout(billingCycle === "monthly" ? "pro-monthly" : "pro-yearly");
  };

  return (
    <Button
      variant="primary"
      onClick={handleClick}
      className={cn("group", className)}
      aria-busy={isLoading}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Redirecting...
        </>
      ) : isSubscribed ? (
        <>
          <ReceiptText className="group-hover:-skew-2 group-hover:scale-110 transition-all duration-300" />
          Manage Subscription
        </>
      ) : (
        <>
          <Zap className="fill-white/25 transition-all duration-300 group-hover:rotate-10 group-hover:scale-125" />{" "}
          Upgrade to Pro
        </>
      )}
    </Button>
  );
}
