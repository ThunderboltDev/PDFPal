import z from "zod";
import axios from "axios";
import { getServerSession } from "next-auth";

import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";

import { getUserSubscriptionPlan } from "@/lib/creem";
import { getAbsoluteUrl } from "@/lib/utils";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email || !session.user?.id)
      throw new TRPCError({ code: "UNAUTHORIZED" });

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

  renameFile: privateProcedure
    .input(
      z.object({
        id: z.string(),
        newName: z
          .string()
          .min(1, "File name is required")
          .max(25, "File name is too long")
          .refine(
            (str) => !/[/\\\n\r]/.test(str),
            "File name cannot contain slashes or newlines"
          )
          .transform((str) => str.trim()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id, newName } = input;

      const file = await db.file.findFirst({
        where: {
          id,
          userId,
        },
        select: {
          key: true,
        },
      });

      if (!file)
        throw new TRPCError({ code: "NOT_FOUND", message: "File not found." });

      await db.file.update({
        where: { id, userId },
        data: { name: newName },
      });
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id } = input;

      const file = await db.file.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id,
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

  getBillingPortalUrl: privateProcedure.mutation(async ({ ctx }) => {
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

  getUserSubscriptionPlan: publicProcedure.query(async () => {
    return await getUserSubscriptionPlan();
  }),
});

export type AppRouter = typeof appRouter;
