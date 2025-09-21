"use client";

import { Loader2, ReceiptText, Zap } from "lucide-react";

import { trpc } from "@/app/_trpc/client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { FormEvent } from "react";

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
      className={className}
      onClick={handleClick}
      variant="primary"
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 mr-4 animate-spin" />
          Redirecting...
        </>
      ) : isSubscribed ? (
        <>
          <ReceiptText />
          Manage Subscription
        </>
      ) : (
        <>
          <Zap /> Upgrade to Pro
        </>
      )}
    </Button>
  );
}
