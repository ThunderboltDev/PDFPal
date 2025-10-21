export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import axios from "axios";
import axiosRetry from "axios-retry";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import config from "@/config";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pinecone } from "@/lib/pinecone";

if (!process.env.PINECONE_INDEX) {
  throw new Error("env variable PINECONE_INDEX not found");
}

const pineconeIndex = process.env.PINECONE_INDEX;
const plans = config.plans;

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

      if (!session?.userId) throw new Error("Unauthorized");

      const user = await db.user.findUnique({
        where: {
          id: session.userId,
        },
        select: {
          currentPeriodEnd: true,
        },
      });

      if (!user) throw new Error("User not found");

      const isSubscribed =
        user.currentPeriodEnd && user.currentPeriodEnd > new Date();

      const limits = isSubscribed
        ? { maxFileSize: config.plans.pro.maxFileSize, maxFileCount: 1 }
        : {
            maxFileSize: config.plans.free.maxFileSize,
            maxFileCount: 1,
          };

      return {
        userId: session.userId,
        fileConfig: limits,
        isSubscribed,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId, isSubscribed } = metadata;
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
        console.log("Fetching from axios");
        const { data } = await customAxios.get(file.ufsUrl, {
          responseType: "arraybuffer",
          timeout: 15 * 60 * 1000,
        });
        console.log("axios fetch successful");

        console.log("About to import mupdf...");
        const mupdf = (await import("mupdf")).default;
        console.log("MuPDF default  import result:", mupdf);
        console.log("MuPDF import result:", Object.keys(mupdf));

        const document = mupdf.Document.openDocument(data, "application/pdf");
        const numberOfPages = document.countPages();

        const plan = isSubscribed ? "pro" : "free";

        if (numberOfPages > config.plans[plan].maxPages) {
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

        if (file.size > plans[plan].maxFileSizeInBytes) {
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

        const pages = [];

        for (let i = 0; i < numberOfPages; i++)
          pages.push(document.loadPage(i).toStructuredText().asText());

        const upsertRequest = pages.map((page, index) => ({
          id: `${createdFile.id}-${index}`,
          text: page,
        }));

        console.log("Getting pinecone namespace");
        const namespace = pinecone
          .index(pineconeIndex, process.env.PINECONE_HOST_URL)
          .namespace(createdFile.id);
        console.log("Got pinecone namespace");

        console.log("Upserting pinecone records");
        await namespace.upsertRecords(upsertRequest);
        console.log("Upserting pinecoe records successful");

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
