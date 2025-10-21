import { TRPCError } from "@trpc/server";
import z from "zod";
import { db } from "@/lib/db";
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

      let nextCursor: typeof cursor | undefined;
      if (messages.length > limit) {
        const nextMessage = messages.pop();
        nextCursor = nextMessage?.id;
      }

      return { messages, nextCursor };
    }),
});
