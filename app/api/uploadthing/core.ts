import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import axios from "axios";

import { getUserSubscriptionPlan } from "@/lib/creem";
import { pinecone } from "@/lib/pinecone";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import config from "@/config";

const plans = config.plans;

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {},
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session || !session.user?.id) throw new Error("Unauthorized");

      const subscriptionPlan = await getUserSubscriptionPlan();
      const limits = subscriptionPlan.isSubscribed
        ? { maxFileSize: config.plans.pro.maxFileSize, maxFileCount: 1 }
        : { maxFileSize: config.plans.free.maxFileSize, maxFileCount: 1 };

      return {
        userId: session.user.id,
        subscriptionPlan,
        fileConfig: limits,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.ufsUrl,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await axios.get(file.ufsUrl, {
          responseType: "arraybuffer",
          timeout: 1 * 60 * 10000,
        });
        const data = await response.data;

        const { Document } = await import("mupdf");

        const document = Document.openDocument(data, "application/pdf");
        const numberOfPages = document.countPages();

        const { isSubscribed } = metadata.subscriptionPlan;

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

        const namespace = pinecone
          .index(process.env.PINECONE_INDEX!, process.env.PINECONE_HOST_URL)
          .namespace(createdFile.id);

        await namespace.upsertRecords(upsertRequest);

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
            userId: metadata.userId,
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
            userId: metadata.userId,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
