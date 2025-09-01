import z from "zod/v4";
import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";

import { db } from "@/lib/db";
import { getAbsoluteUrl } from "@/lib/utils";
import { getUserSubscriptionPlan } from "@/lib/creem";

import config, { CREEM_API_BASE } from "@/config";

type CreemCustomer = { id?: string; email?: string };

interface CheckoutPayload {
  request_id: string;
  success_url: string;
  product_id: string;
  metadata?: Record<string, string | number>;
  customer?: CreemCustomer;
  customer_id?: string;
}

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
      select: { id: true },
    });

    if (!dbUser) {
      await db.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email ?? undefined,
          displayName: user.username ?? undefined,
          avatarUrl: user.picture ?? undefined,
        },
      });
    }

    return { success: true };
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.file.findMany({
      where: {
        userId: userId,
      },
    });
  }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
          userId,
        },
      });

      return file;
    }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(25).default(15),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const { fileId, cursor } = input;
      const limit = input.limit;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        where: {
          fileId,
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextMessage = messages.pop();
        nextCursor = nextMessage?.id;
      }

      return { messages, nextCursor };
    }),
  createCheckoutSession: privateProcedure
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

  getBillingPortalUrl: privateProcedure
    .input(
      z.object({
        customerId: z.string(),
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
            customer_id: input.customerId,
          },
          {
            headers: {
              "x-api-key": process.env.CREEM_API_KEY,
            },
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

export type AppRouter = typeof appRouter;
