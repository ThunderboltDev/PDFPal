"use client";

import { format } from "date-fns";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import CancelSubscriptionButton from "@/components/cancel-subscription";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UpgradeButton } from "@/components/upgrade-button";
import { cn } from "@/lib/utils";

/*

cancel - my impl

pro - active
date 19 oct 2025
renews on 18/11/2025

after canceling

pro - cancelled
date 19 oct 2025
cancels on 18/11/2025



creem impl

*/

export default function Billing() {
  const { data: subscription } =
    trpc.subscription.getUserSubscriptionPlan.useQuery();

  const { data: transactionHistory, isLoading } =
    trpc.subscription.getTransactionHistory.useQuery();
  console.log(transactionHistory);
  return (
    <main className="container-3xl mt-20">
      <h2>Billing</h2>
      <p>
        View and manage your subscription, payment method, and billing history
        in one place
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            <p className="mb-3 text-base">
              {subscription ? (
                <>
                  You are currently on the{" "}
                  <strong>{subscription.name} Plan</strong>.
                </>
              ) : (
                <Skeleton width={200} />
              )}
            </p>
            <p className="text-base">
              {subscription ? (
                <>
                  Status:{" "}
                  <span
                    className={cn({
                      "text-success/90": subscription.status === "active",
                      "text-info/90": subscription.status === "trialing",
                      "text-danger/80": subscription.status === "canceled",
                    })}
                  >
                    {subscription.status.charAt(0).toUpperCase() +
                      subscription.status.slice(1)}
                  </span>
                </>
              ) : (
                <Skeleton width={100} />
              )}
            </p>
            <p className="text-base">
              {subscription ? (
                <>
                  Customer ID:{" "}
                  <span className="font-semibold">
                    {subscription.customerId ?? "---"}
                  </span>
                </>
              ) : (
                <Skeleton width={120} />
              )}
            </p>
            <p className="text-base">
              {subscription ? (
                <>
                  Subscription ID:{" "}
                  <span className="font-semibold">
                    {subscription.subscriptionId ?? "---"}
                  </span>
                </>
              ) : (
                <Skeleton width={140} />
              )}
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-3 md:flex-row md:justify-between md:gap-0">
          <div className="flex flex-col gap-2 xs:flex-row xs:gap-4">
            {subscription ? (
              <>
                <UpgradeButton isSubscribed={subscription.isSubscribed} />
                {subscription.isSubscribed && !subscription.isCanceled && (
                  <CancelSubscriptionButton
                    currentPeriodEnd={
                      subscription.currentPeriodEnd ?? new Date()
                    }
                  />
                )}
              </>
            ) : (
              <Skeleton borderRadius={6} height={36} width={150} />
            )}
          </div>
          <div className="flex flex-col items-start space-y-1 text-sm md:items-end md:text-right">
            {subscription ? (
              <>
                {subscription.currentPeriodEnd ? (
                  <span className="rounded-full text-muted-foreground text-xs text-nowrap">
                    Charged by{" "}
                    <Link href="https://creem.io" target="_blank">
                      Creem
                    </Link>
                    {" • "}
                    <span className="rounded-full text-muted-foreground text-xs">
                      {subscription.isCanceled
                        ? "Your plan will be canceled on "
                        : "Your plan renews on "}
                      {format(subscription.currentPeriodEnd, "dd/MM/yyyy")}
                    </span>
                  </span>
                ) : (
                  <span className="font-medium text-muted-foreground text-xs">
                    No upcoming charges
                  </span>
                )}
                <span className="text-muted-foreground text-xs">
                  Receipts available in the customer portal
                </span>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <Skeleton inline width={300} />
                <Skeleton inline width={230} />
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
      <h3 className="mt-8 mb-4 md:mt-10">Transaction History</h3>
      {isLoading ? (
        <Skeleton height={200} />
      ) : transactionHistory && transactionHistory.items.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border shadow-lg">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.items.map((tx) => (
                <tr
                  className="border-t border-border odd:bg-muted even:bg-secondary"
                  key={tx.id}
                >
                  <td className="px-4 py-2">
                    {format(new Date(tx.createdAt), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-2">
                    Pro Plan {tx.amount === 999 ? "(Monthly)" : "(Yearly)"}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {tx.amountPaid !== undefined
                      ? `$${(tx.amountPaid / 100).toFixed(2)}`
                      : "-"}
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      tx.status === "paid"
                        ? "text-success/90"
                        : "text-danger/80"
                    }`}
                  >
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid place-items-center py-4">
          <p className="text-center text-muted-foreground text-sm">
            No transactions.
          </p>
        </div>
      )}
    </main>
  );
}
