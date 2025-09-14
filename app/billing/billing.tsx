"use client";

import { format } from "date-fns";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { UpgradeButton } from "@/components/upgrade-button";
import { SubscriptionPlan } from "@/lib/creem";
import CancelSubscriptionButton from "@/components/cancel-subscription";

interface BillingProps {
  subscriptionPlan: SubscriptionPlan;
}

export default function Billing({ subscriptionPlan }: BillingProps) {
  return (
    <div className="container-xl mt-18">
      <h2>Billing</h2>
      <p>
        View and manage your subscription, payment method, and billing history
        in one place
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            {subscriptionPlan?.name ? (
              <>
                You are currently on the{" "}
                <span className="font-semibold">
                  {subscriptionPlan.name} Plan
                </span>
                .
              </>
            ) : (
              <Skeleton />
            )}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <div className="flex flex-row gap-4">
            <UpgradeButton isSubscribed={subscriptionPlan?.isSubscribed} />
            {subscriptionPlan.isSubscribed && (
              <CancelSubscriptionButton
                currentPeriodEnd={
                  subscriptionPlan.currentPeriodEnd ?? new Date()
                }
              />
            )}
          </div>
          {subscriptionPlan.isSubscribed &&
            subscriptionPlan.currentPeriodEnd && (
              <p className="rounded-full text-xs text-muted-foreground">
                {subscriptionPlan.isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renews on "}
                {format(subscriptionPlan.currentPeriodEnd, "dd/MM/yyyy")}
              </p>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
