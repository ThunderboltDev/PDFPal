import axios from "axios";
import axiosRetry from "axios-retry";
import { extractText } from "unpdf";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import config from "@/config";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
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
      const session = await auth();

      if (!session) throw new Error("Unauthorized");

      const user = await db.user.findUnique({
        where: {
          id: session.userId,
        },
        select: {
          currentPeriodEnd: true,
          _count: {
            select: {
              File: true,
            },
          },
        },
      });

      if (!user) throw new Error("User not found");

      const isSubscribed =
        user.currentPeriodEnd && user.currentPeriodEnd > new Date();

      const plan = config.plans[isSubscribed ? "pro" : "free"];

      const fileConfig = {
        maxPages: plan.maxPages,
        maxFiles: plan.maxFiles,
        maxFileSize: plan.maxFileSize,
        maxFileSizeInBytes: plan.maxFileSizeInBytes,
      };

      if (user._count.File >= fileConfig.maxFiles) {
        throw new Error(
          isSubscribed
            ? "You've reached your upload limit for this plan."
            : "You've reached your free upload limit. Upgrade your plan to upload more files."
        );
      }

      return {
        userId: session.userId,
        fileConfig,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId, fileConfig } = metadata;

      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId,
          url: file.ufsUrl,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const { data } = await axios.get(file.ufsUrl, {
          responseType: "arraybuffer",
          timeout: 15 * 60 * 1000,
        });

        const { totalPages: numberOfPages, text: pages } = await extractText(
          new Uint8Array(data)
        );

        if (numberOfPages > fileConfig.maxPages) {
          await db.file.update({
            where: {
              id: createdFile.id,
            },
            data: {
              uploadStatus: "FAILED_TOO_MANY_PAGES",
            },
          });

          return;
        }

        if (file.size > fileConfig.maxFileSizeInBytes) {
          await db.file.update({
            where: {
              id: createdFile.id,
            },
            data: {
              uploadStatus: "FAILED_TOO_LARGE",
            },
          });

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

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
            userId,
          },
        });
      } catch (error) {
        console.error(error);
        await db.file.update({
          data: {
            uploadStatus: "FAILED_UNKNOWN",
          },
          where: {
            id: createdFile.id,
            userId,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
