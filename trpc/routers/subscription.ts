import { eq } from "drizzle-orm";
import { config } from "@/config";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth, dodoPayments } from "@/lib/auth";
import { createRateLimit, privateProcedure, router } from "@/trpc/trpc";

const plans = config.plans;

export const subscriptionRouter = router({
  getUserSubscriptionPlan: privateProcedure
    .use(createRateLimit(3, 60, "get-user-subscription-plan"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const user = await db.query.user.findFirst({
        where: eq(usersTable.id, userId),
        columns: {
          customerId: true,
          subscriptionId: true,
          currentPeriodEnd: true,
        },
      });

      if (
        !user?.subscriptionId ||
        !user.customerId ||
        !user.currentPeriodEnd ||
        user.currentPeriodEnd < new Date()
      ) {
        return {
          ...plans.free,
          status: "active",
          customerId: null,
          subscriptionId: null,
          isCanceled: false,
          isSubscribed: false,
          billingPeriod: "lifetime",
          currentPeriodEnd: null,
        };
      }

      try {
        const subscriptions = await auth.api.dodoSubscriptions();
        const subscription = subscriptions.items[0];

        return {
          ...plans.pro,
          status: subscription.status,
          customerId: subscription.customer.customer_id,
          subscriptionId: user.subscriptionId,
          isCanceled: subscription.status === "cancelled",
          isSubscribed: true,
          billingPeriod: "monthly",
          currentPeriodEnd: user.currentPeriodEnd,
        };
      } catch {
        return {
          ...plans.pro,
          status: "active",
          customerId: user.customerId,
          subscriptionId: user.subscriptionId,
          isCanceled: false,
          isSubscribed: true,
          billingPeriod: "infinite",
          currentPeriodEnd: user.currentPeriodEnd,
        };
      }
    }),

  getTransactionHistory: privateProcedure
    .use(createRateLimit(3, 60, "get-transaction-history"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const user = await db.query.user.findFirst({
        where: eq(usersTable.id, userId),
        columns: {
          customerId: true,
          subscriptionId: true,
          currentPeriodEnd: true,
        },
      });

      if (
        !user?.subscriptionId ||
        !user.customerId ||
        !user.currentPeriodEnd ||
        user.currentPeriodEnd < new Date()
      ) {
        return [];
      }

      try {
        const subscription = await dodoPayments.payments.list({
          page_size: 10,
          customer_id: user.customerId,
        });

        return subscription.items;
      } catch {
        return [];
      }
    }),
});
