import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { pinecone } from "@/lib/pinecone";
import { db } from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.id) throw new Error("unauthorized");
      return {
        userId: user.id,
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
        const response = await fetch(file.ufsUrl);
        const data = await response.arrayBuffer();

        const { Document } = await import("mupdf");

        const document = Document.openDocument(data, "application/pdf");

        const numberOfPages = document.countPages();

        const pages = [];

        for (let i = 1; i <= numberOfPages; i++)
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
            uploadStatus: "FAILED",
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
