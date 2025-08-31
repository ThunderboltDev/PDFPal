import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";

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
        const blob = await response.blob();
        const loader = new PDFLoader(blob, {
          splitPages: true,
        });

        const docs = await loader.load();
        const upsertRequest = docs.map((doc, index) => ({
          id: `${createdFile.id}-${index}`,
          text: doc.pageContent,
        }));

        // const numberOfPages = docs.length;

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
