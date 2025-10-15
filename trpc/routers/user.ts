import z from "zod";
import { db } from "@/lib/db";
import { createRateLimit, privateProcedure, router } from "@/trpc/trpc";

export const userRouter = router({
  getUserSessions: privateProcedure
    .use(createRateLimit(3, 30, "get-user-sessions"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const sessions = await db.session.findMany({
        where: { userId },
        select: {
          sessionToken: true,
          lastActivity: true,
          userAgent: true,
          country: true,
          city: true,
        },
      });

      return sessions;
    }),

  deleteUserSession: privateProcedure
    .use(createRateLimit(3, 5 * 60, "delete-user-session"))
    .input(z.object({ sessionToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { count } = await db.session.deleteMany({
        where: {
          sessionToken: input.sessionToken,
          userId: ctx.userId,
        },
      });

      return { success: true, count };
    }),

  getUserWithAccounts: privateProcedure
    .use(createRateLimit(1, 30, "get-user-with-accounts"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      return await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          subscriptionId: true,
          accounts: {
            select: {
              provider: true,
              createdAt: true,
            },
          },
        },
      });
    }),

  getTotalUsage: privateProcedure
    .use(createRateLimit(1, 60, "get-total-usage"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;
      const totalUsage = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          _count: {
            select: {
              File: true,
              Message: true,
            },
          },
        },
      });

      return {
        messages: totalUsage?._count.Message ?? 0,
        files: totalUsage?._count.File ?? 0,
      };
    }),

  deleteAccount: privateProcedure
    .use(createRateLimit(1, 60, "delete-account"))
    .mutation(async ({ ctx }) => {
      const { userId } = ctx;

      await db.user.delete({
        where: { id: userId },
      });

      return { success: true };
    }),
});
