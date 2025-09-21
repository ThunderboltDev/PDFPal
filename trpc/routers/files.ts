import { router, filesProcedure } from "@/trpc/trpc";
import { utapi } from "@/app/server/uploadthing";
import { pinecone } from "@/lib/pinecone";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import z from "zod";

export const filesRouter = router({
  getUserFiles: filesProcedure.input(z.void()).query(async ({ ctx }) => {
    const { userId } = ctx;
    const files = await db.file.findMany({
      where: {
        userId: userId,
      },
    });

    const messageCounts = files.length
      ? await db.message.groupBy({
          by: ["fileId"],
          where: { fileId: { in: files.map((f) => f.id) } },
          _count: { id: true },
        })
      : [];

    const countsMap: Record<string, number> = {};

    messageCounts.forEach((messageCount) => {
      const fileId = messageCount.fileId;
      if (fileId) countsMap[fileId] = messageCount._count.id;
    });

    return files.map((file) => ({
      ...file,
      messageCount: countsMap[file.id] ?? 0,
    }));
  }),

  getFileUploadStatus: filesProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PROCESSING" as const };

      return { status: file.uploadStatus };
    }),

  getFile: filesProcedure
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

  renameFile: filesProcedure
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

      await utapi.renameFiles({
        fileKey: file.key,
        newName,
      });

      return file;
    }),

  deleteFile: filesProcedure
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

      await utapi.deleteFiles(file.key);

      const index = pinecone.index(
        process.env.PINECONE_INDEX!,
        process.env.PINECONE_HOST_URL
      );

      await index.deleteNamespace(file.id);

      return file;
    }),
});
