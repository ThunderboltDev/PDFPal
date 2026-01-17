import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { filesTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import FileView from "./file";

const getFile = cache(
  async (fileId: string, userId: string) =>
    await db.query.files.findFirst({
      where: and(eq(filesTable.id, fileId), eq(filesTable.userId, userId)),
    })
);

interface FileViewPageProps {
  params: Promise<{ fileId: string }>;
}

export async function generateMetadata({
  params,
}: FileViewPageProps): Promise<Metadata> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { fileId } = await params;

  if (!session?.user?.email) {
    return {
      title: "Unauthorized - Please Login",
      description: "You must be signed in to view this file.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const file = await getFile(fileId, session.user.id);

  if (!file) {
    return {
      title: "File Not Found",
      description: "The file you're trying to access does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: file.name,
    description:
      "View your uploaded PDf. Chat with the AI for summaries, insights, and analysis using PDF Pal.",
    openGraph: {
      title: file.name,
      description: "Interact with your PDF using AI-powered features.",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function FileViewPage({ params }: FileViewPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { fileId } = await params;

  if (!session?.user?.id) {
    return redirect(
      `/auth?callbackUrl=${encodeURIComponent(`/dashboard/${fileId}`)}`
    );
  }

  const file = await getFile(fileId, session.user.id);

  if (!file) notFound();

  const user = await db.query.users.findFirst({
    where: eq(usersTable.id, session.user.id),
    columns: {
      currentPeriodEnd: true,
    },
  });

  const isSubscribed =
    !!user?.currentPeriodEnd && user.currentPeriodEnd > new Date();

  return <FileView file={file} isSubscribed={isSubscribed} />;
}
