"use client";

import { format } from "date-fns";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CancelSubscriptionButton from "@/components/cancel-subscription";
import { UpgradeButton } from "@/components/upgrade-button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";

export default function Billing() {
  const { data: subscription } =
    trpc.subscription.getUserSubscriptionPlan.useQuery();

  const { data: transactionHistory, isLoading } =
    trpc.subscription.getTransactionHistory.useQuery();

  return (
    <main className="container-3xl mt-18">
      <h2>Billing</h2>
      <p>
        View and manage your subscription, payment method, and billing history
        in one place
      </p>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            <p className="text-base mb-3">
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
                  <span className="text-success/75">
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
                <Skeleton width={100} />
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
                <Skeleton width={100} />
              )}
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <div className="flex flex-row gap-4">
            {subscription ? (
              <>
                <UpgradeButton isSubscribed={subscription.isSubscribed} />
                {subscription.isSubscribed && (
                  <CancelSubscriptionButton
                    currentPeriodEnd={
                      subscription.currentPeriodEnd ?? new Date()
                    }
                  />
                )}
              </>
            ) : (
              <>
                <Skeleton
                  borderRadius={6}
                  height={36}
                  width={150}
                />
                <Skeleton
                  borderRadius={6}
                  height={36}
                  width={183}
                />
              </>
            )}
          </div>
          <div className="flex flex-col items-start space-y-1 text-sm md:items-end">
            {subscription && subscription.currentPeriodEnd ? (
              <span className="rounded-full text-xs text-muted-foreground">
                Charged by{" "}
                <Link
                  href="https://creem.io"
                  target="_blank"
                >
                  Creem
                </Link>
                {" • "}
                <span className="rounded-full text-xs text-muted-foreground">
                  {subscription.isCanceled
                    ? "Your plan will be canceled on "
                    : "Your plan renews on "}
                  {format(subscription.currentPeriodEnd, "dd/MM/yyyy")}
                </span>
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                No upcoming charges
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Receipts available in the customer portal
            </span>
          </div>
        </CardFooter>
      </Card>
      <h3 className="mt-8 mb-4">Transaction History</h3>
      {!isLoading ? (
        transactionHistory && transactionHistory.items.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Description</th>
                  <th className="text-left px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.items.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-t hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-4 py-2">
                      {format(new Date(tx.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-2">Pro Plan</td>
                    <td className="px-4 py-2 font-medium">
                      {tx.amount ? `$${(tx.amount / 100).toFixed(2)}` : "-"}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        tx.status === "succeeded"
                          ? "text-success"
                          : tx.status === "pending"
                          ? "text-warning"
                          : "text-danger"
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </td>
                    <td className="px-4 py-2">
                      {tx.discountAmount ? tx.discountAmount / 100 : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid place-items-center py-4">
            <p className="text-sm text-muted-foreground text-center">
              No transactions.
            </p>
          </div>
        )
      ) : (
        <div>
          <Skeleton
            borderRadius={8}
            height={50}
            count={3}
          />
        </div>
      )}
    </main>
  );
}
