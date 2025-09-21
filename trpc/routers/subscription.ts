import { router, subscriptionProcedure } from "@/trpc/trpc";
import { getUserSubscriptionPlan } from "@/lib/creem";
import config, { CREEM_API_BASE } from "@/config";
import { getAbsoluteUrl } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import axios from "axios";
import z from "zod";

type CreemCustomer = { id?: string; email?: string };

interface CheckoutPayload {
  request_id: string;
  success_url: string;
  product_id: string;
  metadata?: Record<string, string | number>;
  customer?: CreemCustomer;
  customer_id?: string;
}

export const subscriptionRouter = router({
  createCheckoutSession: subscriptionProcedure
    .input(
      z.object({
        productId: z.string().optional().default(config.plans.pro.productId),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const dbUser = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

      const productId = input.productId;
      const billingUrl = getAbsoluteUrl("/dashboard/billing");
      const subscriptionPlan = await getUserSubscriptionPlan();

      const payload: CheckoutPayload = {
        request_id: `creem_checkout_${userId}_${Date.now()}`,
        success_url: billingUrl,
        product_id: productId,
        metadata: {
          userId: userId,
        },
      };

      if (subscriptionPlan.customerId) {
        payload.customer_id = subscriptionPlan.customerId;
        payload.customer = { id: subscriptionPlan.customerId };
      } else if (dbUser.email) {
        payload.customer = { email: dbUser.email };
      }

      try {
        const response = await axios.post(
          `${CREEM_API_BASE}/checkouts`,
          payload,
          {
            headers: {
              "x-api-key": process.env.CREEM_API_KEY,
            },
            timeout: 10_000,
            proxy: false,
          }
        );

        const { checkout_url } = response.data;
        return { checkoutUrl: checkout_url };
      } catch (error) {
        console.error("Error in createCheckoutSession:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not initiate billing session",
        });
      }
    }),

  getBillingPortalUrl: subscriptionProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (!subscriptionPlan.customerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription",
      });
    }

    try {
      const response = await axios.post(
        `${CREEM_API_BASE}/customers/billing`,
        {
          customer_id: subscriptionPlan.customerId,
        },
        {
          headers: {
            "x-api-key": process.env.CREEM_API_KEY,
          },
          timeout: 10_000,
          proxy: false,
        }
      );

      const { customer_portal_link } = response.data;
      return { portalUrl: customer_portal_link };
    } catch (error) {
      console.error("Error in createCheckoutSession:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not initiate billing session",
      });
    }
  }),
});
