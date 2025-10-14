import axios from "axios";
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
				},
			});

			if (!user) throw new Error("User not found");

			const isSubscribed =
				user.currentPeriodEnd && user.currentPeriodEnd > new Date();

			const limits = isSubscribed
				? { maxFileSize: config.plans.pro.maxFileSize, maxFileCount: 1 }
				: { maxFileSize: config.plans.free.maxFileSize, maxFileCount: 1 };

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
				const { data } = await axios.get(file.ufsUrl, {
					responseType: "arraybuffer",
					timeout: 5 * 60 * 10_000,
				});

				const { Document } = await import("mupdf");

				const document = Document.openDocument(data, "application/pdf");
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
