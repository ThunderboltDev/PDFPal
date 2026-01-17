import { and, count, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import {
  filesTable,
  messagesTable,
  sessionsTable,
  usersTable,
} from "@/db/schema";
import { createRateLimit, privateProcedure, router } from "@/trpc/trpc";

export const userRouter = router({
  getUserSessions: privateProcedure
    .use(createRateLimit(3, 30, "get-user-sessions"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      const userSessions = await db.query.session.findMany({
        where: eq(sessionsTable.userId, userId),
        columns: {
          token: true,
          lastActivity: true,
          userAgent: true,
          country: true,
          city: true,
        },
      });

      return userSessions;
    }),

  deleteUserSession: privateProcedure
    .use(createRateLimit(3, 5 * 60, "delete-user-session"))
    .input(z.object({ sessionToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .delete(sessionsTable)
        .where(
          and(
            eq(sessionsTable.token, input.sessionToken),
            eq(sessionsTable.userId, ctx.userId)
          )
        );

      return { success: true, count: result.count };
    }),

  getUserWithAccounts: privateProcedure
    .use(createRateLimit(1, 30, "get-user-with-accounts"))
    .query(async ({ ctx }) => {
      const { userId } = ctx;

      return await db.query.user.findFirst({
        where: eq(usersTable.id, userId),
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
          subscriptionId: true,
        },
        with: {
          accounts: {
            columns: {
              providerId: true,
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

      const [messagesCount] = await db
        .select({ count: count() })
        .from(messagesTable)
        .where(eq(messagesTable.userId, userId));

      const [filesCount] = await db
        .select({ count: count() })
        .from(filesTable)
        .where(eq(filesTable.userId, userId));

      return {
        messages: messagesCount?.count ?? 0,
        files: filesCount?.count ?? 0,
      };
    }),

  deleteAccount: privateProcedure
    .use(createRateLimit(1, 60, "delete-account"))
    .mutation(async ({ ctx }) => {
      const { userId } = ctx;

      await db.delete(usersTable).where(eq(usersTable.id, userId));

      return { success: true };
    }),
});
