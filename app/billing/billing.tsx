"use client";

import { ReceiptText, Loader2, Zap } from "lucide-react";

import { toast } from "sonner";
import { format } from "date-fns";
import { FormEvent } from "react";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionPlan } from "@/lib/creem";

interface BillingProps {
  subscriptionPlan: SubscriptionPlan;
}

export default function Billing({ subscriptionPlan }: BillingProps) {
  const { name, isCanceled, isSubscribed, currentPeriodEnd, customerId } =
    subscriptionPlan;

  const { mutate: createCheckoutSession, isPending } =
    trpc.createCheckoutSession.useMutation({
      onSuccess: ({ checkoutUrl }) => {
        if (checkoutUrl) window.location.href = checkoutUrl;
        else toast.error("Something went wrong!");
      },
    });

  const { mutate: getBillingPortalUrl } = trpc.getBillingPortalUrl.useMutation({
    onSuccess: ({ portalUrl }) => {
      if (portalUrl) window.location.href = portalUrl;
      else toast.error("Something went wrong!");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSubscribed && customerId) getBillingPortalUrl({ customerId });
    else createCheckoutSession({});
  };

  return (
    <div className="container-xl mt-18">
      <h2>Billing</h2>
      <p>Manage subscriptions</p>
      <form onSubmit={handleSubmit}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the{" "}
              <span className="font-semibold">{name} Plan</span>.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button
              type="submit"
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

            {isSubscribed && currentPeriodEnd && (
              <p className="rounded-full text-xs text-muted-foreground">
                {isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renews on "}
                {format(currentPeriodEnd, "dd/MM/yyyy")}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
