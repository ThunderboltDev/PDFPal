import { TRPCError } from "@trpc/server";
import { and, count, eq, inArray } from "drizzle-orm";
import z from "zod";
import { utapi } from "@/app/server/uploadthing";
import { db } from "@/db";
import { filesTable, messagesTable } from "@/db/schema";
import { pinecone } from "@/lib/pinecone";
import { createRateLimit, privateProcedure, router } from "@/trpc/trpc";

if (!process.env.PINECONE_INDEX) {
  throw new Error("env variable PINECONE_INDEX not found");
}

const pineconeIndex = process.env.PINECONE_INDEX;

export const filesRouter = router({
  getUserFiles: privateProcedure
    .use(createRateLimit(10, 5 * 60, "get-user-files"))
    .input(z.void())
    .query(async ({ ctx }) => {
      const { userId } = ctx;
      const userFiles = await db.query.file.findMany({
        where: eq(filesTable.userId, userId),
      });

      const messageCounts = userFiles.length
        ? await db
            .select({
              fileId: messagesTable.fileId,
              count: count(messagesTable.id),
            })
            .from(messagesTable)
            .where(
              inArray(
                messagesTable.fileId,
                userFiles.map((f) => f.id)
              )
            )
            .groupBy(messagesTable.fileId)
        : [];

      const countsMap: Record<string, number> = {};

      messageCounts.forEach((messageCount) => {
        const fileId = messageCount.fileId;
        if (fileId) countsMap[fileId] = messageCount.count;
      });

      return userFiles.map((file) => ({
        ...file,
        messageCount: countsMap[file.id] ?? 0,
      }));
    }),

  getFileUploadStatus: privateProcedure
    .use(createRateLimit(1, 10, "get-file-upload-status"))
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.query.file.findFirst({
        where: and(
          eq(filesTable.id, input.fileId),
          eq(filesTable.userId, ctx.userId)
        ),
      });

      if (!file) return { status: "PROCESSING" as const };

      return { status: file.uploadStatus };
    }),

  getFile: privateProcedure
    .use(createRateLimit(1, 15, "get-file"))
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.query.file.findFirst({
        where: and(
          eq(filesTable.key, input.key),
          eq(filesTable.userId, userId)
        ),
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

  renameFile: privateProcedure
    .use(createRateLimit(1, 10, "rename-file"))
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

      const file = await db.query.file.findFirst({
        where: and(eq(filesTable.id, id), eq(filesTable.userId, userId)),
        columns: {
          key: true,
        },
      });

      if (!file)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found.",
        });

      await db
        .update(filesTable)
        .set({ name: newName })
        .where(and(eq(filesTable.id, id), eq(filesTable.userId, userId)));

      await utapi.renameFiles({
        fileKey: file.key,
        newName,
      });

      return file;
    }),

  deleteFile: privateProcedure
    .use(createRateLimit(1, 15, "delete-file"))
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { id } = input;

      const file = await db.query.file.findFirst({
        where: and(eq(filesTable.id, id), eq(filesTable.userId, userId)),
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db
        .delete(filesTable)
        .where(and(eq(filesTable.id, id), eq(filesTable.userId, userId)));

      try {
        await utapi.deleteFiles(file.key);

        const index = pinecone.index(
          pineconeIndex,
          process.env.PINECONE_HOST_URL
        );

        await index.deleteNamespace(file.id);
      } catch {}

      return file;
    }),
});
