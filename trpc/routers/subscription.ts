import { TRPCError } from "@trpc/server";
import z from "zod";

import { router, privateProcedure, createRateLimit } from "@/trpc/trpc";
import { creem, extractCustomerId } from "@/lib/creem";
import { db } from "@/lib/db";
import config from "@/config";

const plans = config.plans;

export const subscriptionRouter = router({
  createCheckoutSession: privateProcedure
    .use(createRateLimit(1, 2 * 60, "create-checkout-sessions"))
    .input(
      z.object({
        productId: z
          .string()
          .optional()
          .default(config.plans.pro.productId.monthly),
        discountCode: z.string().optional().default(""),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          email: true,
          subscriptionId: true,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found!",
        });

      const returnUrl = process.env.NEXT_PUBLIC_BASE_URL + "/billing";

      const { checkoutUrl } = await creem.createCheckout({
        createCheckoutRequest: {
          customer: {
            email: user.email,
          },
          discountCode: input.discountCode,
          productId: input.productId,
          successUrl: returnUrl,
        },
        xApiKey: process.env.CREEM_API_KEY!,
      });

      return {
        checkoutUrl,
      };
    }),

  getBillingPortalUrl: privateProcedure
    .use(createRateLimit(1, 2 * 60, "get-billing-portal-url"))
    .mutation(async ({ ctx }) => {
      const { userId } = ctx;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          email: true,
          customerId: true,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found!",
        });

      if (!user.customerId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active subscription found!",
        });

      const { customerPortalLink } = await creem.generateCustomerLinks({
        createCustomerPortalLinkRequestEntity: {
          customerId: user.customerId,
        },
        xApiKey: process.env.CREEM_API_KEY!,
      });

      return {
        portalUrl: customerPortalLink,
      };
    }),

  cancelSubscription: privateProcedure
    .use(createRateLimit(1, 60, "cancel-subscription"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          subscriptionId: true,
        },
      });

      if (!user?.subscriptionId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not have an active subscription",
        });

      await creem.cancelSubscription({
        id: user?.subscriptionId,
        xApiKey: process.env.CREEM_API_KEY!,
      });

      return { success: true };
    }),

  getUserSubscriptionPlan: privateProcedure
    .use(createRateLimit(3, 60, "get-user-subscription-plan"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          subscriptionId: true,
          currentPeriodEnd: true,
        },
      });

      if (!user || !user.subscriptionId) {
        return {
          ...plans.free,
          status: "Active",
          customerId: null,
          subscriptionId: null,
          isCanceled: false,
          isSubscribed: false,
          billingPeriod: "Lifetime",
          currentPeriodEnd: null,
        };
      }

      const subscription = await creem.retrieveSubscription({
        subscriptionId: user.subscriptionId,
        xApiKey: process.env.CREEM_API_KEY!,
      });

      return {
        ...plans.pro,
        status: subscription.status,
        customerId: extractCustomerId(subscription),
        subscriptionId: user.subscriptionId,
        isCanceled: subscription.status === "canceled",
        isSubscribed: true,
        billingPeriod:
          typeof subscription.product !== "string"
            ? subscription.product.billingPeriod
            : "unknown",
        currentPeriodEnd: user.currentPeriodEnd,
      };
    }),

  getTransactionHistory: privateProcedure
    .use(createRateLimit(2, 60, "get-transaction-history"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          customerId: true,
        },
      });

      if (!user || !user.customerId) {
        return {
          items: [],
          pagination: {},
        };
      }

      const transactionHistory = await creem.searchTransactions({
        customerId: user.customerId,
        pageNumber: 1,
        xApiKey: process.env.CREEM_API_KEY!,
      });

      return {
        ...transactionHistory,
      };
    }),
});
