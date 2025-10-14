import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import FileView from "./file";

const getFile = cache(
	async (fileId: string, userId: string) =>
		await db.file.findFirst({
			where: {
				id: fileId,
				userId,
			},
		}),
);

interface FileViewPageProps {
	params: Promise<{ fileId: string }>;
}

export async function generateMetadata({
	params,
}: FileViewPageProps): Promise<Metadata> {
	const session = await auth();
	const { fileId } = await params;

	if (!session?.user?.email) {
		return {
			title: "Unauthorized - Please Login",
			description: "You must be signed in to view this file.",
			robots: {
				index: false,
				follow: true,
			},
		};
	}

	const file = await getFile(fileId, session.userId);

	if (!file) {
		return {
			title: "File Not Found",
			description: "The file you're trying to access does not exist.",
			robots: {
				index: false,
				follow: true,
			},
		};
	}

	return {
		title: file.name,
		description:
			"View your uploaded PDf. Chat with the AI, summarise, get insights!",
		openGraph: {
			title: file.name,
			description: "Interact your PDF using AI-powered features.",
		},
		robots: {
			index: false,
			follow: true,
		},
	};
}

export default async function FileViewPage({ params }: FileViewPageProps) {
	const session = await auth();
	const { fileId } = await params;

	if (!session?.userId) {
		return redirect(
			`/auth?callbackUrl=${encodeURIComponent(`/dashboard/${fileId}`)}`,
		);
	}

	const file = await getFile(fileId, session.userId);

	if (!file) notFound();

	const user = await db.user.findUnique({
		where: {
			id: session.userId,
		},
		select: {
			currentPeriodEnd: true,
		},
	});

	const isSubscribed =
		!!user?.currentPeriodEnd && user.currentPeriodEnd > new Date();

	return <FileView file={file} isSubscribed={isSubscribed} />;
}
