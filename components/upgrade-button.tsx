"use client";

import { Loader2, ReceiptText, Zap } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  className?: string;
  isSubscribed: boolean;
}

export function UpgradeButton({
  isSubscribed,
  className = "",
}: UpgradeButtonProps) {
  const { mutate: createCheckoutSession, isPending } =
    trpc.subscription.createCheckoutSession.useMutation({
      onSuccess: ({ checkoutUrl }) => {
        if (checkoutUrl) window.location.href = checkoutUrl;
        else toast.error("Something went wrong!");
      },
    });

  const { mutate: getBillingPortalUrl } =
    trpc.subscription.getBillingPortalUrl.useMutation({
      onSuccess: ({ portalUrl }) => {
        if (portalUrl) window.location.href = portalUrl;
        else toast.error("Something went wrong!");
      },
    });

  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    if (isSubscribed) getBillingPortalUrl();
    else createCheckoutSession({});
  };

  return (
    <Button
      className={cn("group", className)}
      onClick={handleClick}
      variant="primary"
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Redirecting...
        </>
      ) : isSubscribed ? (
        <>
          <ReceiptText className="" />
          Manage Subscription
        </>
      ) : (
        <>
          <Zap className="fill-white/25 group-hover:rotate-10 group-hover:scale-125 transition-all duration-300" />{" "}
          Upgrade to Pro
        </>
      )}
    </Button>
  );
}
