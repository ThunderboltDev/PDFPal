"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { Loader2, ReceiptText, Zap } from "lucide-react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
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
        sendGTMEvent({
          value: 1,
          event: "subscription_action",
          action: "upgrade",
          button_name: "Upgrade Button",
        });
        if (checkoutUrl) window.location.href = checkoutUrl;
        else toast.error("Something went wrong!");
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    });

  const { mutate: getBillingPortalUrl } =
    trpc.subscription.getBillingPortalUrl.useMutation({
      onSuccess: ({ portalUrl }) => {
        sendGTMEvent({
          value: 1,
          event: "subscription_action",
          action: "manage_subscription",
          button_name: "Manage Subscription",
        });
        if (portalUrl) window.location.href = portalUrl;
        else toast.error("Something went wrong!");
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    });

  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    if (isSubscribed) getBillingPortalUrl();
    else createCheckoutSession({});
  };

  return (
    <Button
      aria-busy={isPending}
      className={cn("group", className)}
      disabled={isPending}
      onClick={handleClick}
      variant="primary"
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
          <Zap className="fill-white/25 transition-all duration-300 group-hover:rotate-10 group-hover:scale-125" />{" "}
          Upgrade to Pro
        </>
      )}
    </Button>
  );
}
