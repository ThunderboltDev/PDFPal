import { TRPCError } from "@trpc/server";
import { and, eq, lt, or, type SQL } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { filesTable, messagesTable } from "@/db/schema";
import { createRateLimit, privateProcedure, router } from "@/trpc/trpc";

export const chatRouter = router({
  getFileMessages: privateProcedure
    .use(createRateLimit(10, 60, "get-file-messages"))
    .input(
      z.object({
        limit: z.number().min(1).max(25).default(15),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { fileId, cursor, limit } = input;
      const { userId } = ctx;

      const file = await db.query.file.findFirst({
        where: and(eq(filesTable.id, fileId), eq(filesTable.userId, userId)),
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      let cursorCondition: SQL | undefined;

      if (cursor) {
        const cursorMessage = await db.query.message.findFirst({
          where: eq(messagesTable.id, cursor),
          columns: { createdAt: true, id: true },
        });

        if (cursorMessage) {
          cursorCondition = or(
            lt(messagesTable.createdAt, cursorMessage.createdAt),
            and(
              eq(messagesTable.createdAt, cursorMessage.createdAt),
              lt(messagesTable.id, cursorMessage.id)
            )
          );
        }
      }

      const fileMessages = await db.query.message.findMany({
        where: and(
          eq(messagesTable.fileId, fileId),
          eq(messagesTable.userId, userId),
          cursorCondition
        ),
        orderBy: (messages, { desc }) => [
          desc(messages.createdAt),
          desc(messages.id),
        ],
        columns: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
        limit: limit + 1,
      });

      let nextCursor: typeof cursor | undefined;
      if (fileMessages.length > limit) {
        const nextMessage = fileMessages.pop();
        nextCursor = nextMessage?.id;
      }

      return { messages: fileMessages, nextCursor };
    }),
});
