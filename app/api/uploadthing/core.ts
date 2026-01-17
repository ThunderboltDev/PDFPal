import axios from "axios";
import axiosRetry from "axios-retry";
import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { extractText } from "unpdf";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { config } from "@/config";
import { db } from "@/db";
import { filesTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { pinecone } from "@/lib/pinecone";

if (!process.env.PINECONE_INDEX) {
  throw new Error("env variable PINECONE_INDEX not found");
}

export const runtime = "nodejs";

const pineconeIndex = process.env.PINECONE_INDEX;

const f = createUploadthing();
const customAxios = axios.create();

axiosRetry(customAxios, {
  retries: 3,
});

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {},
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) throw new Error("Unauthorized");

      const user = await db.query.user.findFirst({
        where: eq(usersTable.id, session.user.id),
        columns: {
          currentPeriodEnd: true,
        },
      });

      if (!user) throw new Error("User not found");

      const [filesCount] = await db
        .select({ count: count() })
        .from(filesTable)
        .where(eq(filesTable.userId, session.user.id));

      const fileCount = filesCount?.count ?? 0;

      const isSubscribed =
        user.currentPeriodEnd && user.currentPeriodEnd > new Date();

      const plan = config.plans[isSubscribed ? "pro" : "free"];

      const fileConfig = {
        maxPages: plan.maxPages,
        maxFiles: plan.maxFiles,
        maxFileSize: plan.maxFileSize,
        maxFileSizeInBytes: plan.maxFileSizeInBytes,
      };

      if (fileCount >= fileConfig.maxFiles) {
        throw new Error(
          isSubscribed ?
            "You've reached your upload limit for this plan."
          : "You've reached your free upload limit. Upgrade your plan to upload more files."
        );
      }

      return {
        userId: session.user.id,
        fileConfig,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId, fileConfig } = metadata;

      const [createdFile] = await db
        .insert(filesTable)
        .values({
          key: file.key,
          name: file.name,
          userId,
          url: file.ufsUrl,
          uploadStatus: "PROCESSING",
        })
        .returning();

      try {
        const { data } = await axios.get(file.ufsUrl, {
          responseType: "arraybuffer",
          timeout: 15 * 60 * 1000,
        });

        const { totalPages: numberOfPages, text: pages } = await extractText(
          new Uint8Array(data)
        );

        if (numberOfPages > fileConfig.maxPages) {
          await db
            .update(filesTable)
            .set({
              uploadStatus: "FAILED_TOO_MANY_PAGES",
            })
            .where(eq(filesTable.id, createdFile.id));

          return;
        }

        if (file.size > fileConfig.maxFileSizeInBytes) {
          await db
            .update(filesTable)
            .set({
              uploadStatus: "FAILED_TOO_LARGE",
            })
            .where(eq(filesTable.id, createdFile.id));

          return;
        }

        const upsertRequest = pages.map((text, index) => ({
          id: `${createdFile.id}-${index}`,
          text: text,
        }));

        const namespace = pinecone
          .index(pineconeIndex, process.env.PINECONE_HOST_URL)
          .namespace(createdFile.id);

        await namespace.upsertRecords(upsertRequest);

        await db
          .update(filesTable)
          .set({
            uploadStatus: "SUCCESS",
          })
          .where(eq(filesTable.id, createdFile.id));
      } catch (error) {
        console.error(error);
        await db
          .update(filesTable)
          .set({
            uploadStatus: "FAILED_UNKNOWN",
          })
          .where(eq(filesTable.id, createdFile.id));
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
