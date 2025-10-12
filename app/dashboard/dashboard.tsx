"use client";

import {
  AlertCircle,
  AlertTriangle,
  Ghost,
  Loader2,
  MessageSquare,
  Plus,
} from "lucide-react";

import Link from "next/link";
import { format } from "date-fns";

import { trpc } from "../_trpc/client";
import UploadButton from "./upload-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DeleteFileDialog, RenameFileDialog } from "./dialogs";

export default function Dashboard() {
  const { data: files, isLoading } = trpc.file.getUserFiles.useQuery();
  const { data: subscriptionPlan } =
    trpc.subscription.getUserSubscriptionPlan.useQuery();

  return (
    <main className="container-7xl pt-20">
      <div className="flex flex-col items-start justify-between gap-2 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h2 className="mb-1">My Files</h2>
        {subscriptionPlan ? (
          <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
        ) : (
          <Skeleton
            borderRadius={6}
            width={126}
            height={36}
          />
        )}
      </div>
      <Separator />
      {files && files.length !== 0 ? (
        <ul className="ml-0 mt-8 mb-12 px-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-border rounded-lg bg-secondary shadow-md transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex items-center justify-center px-4 py-3 gap-3 no-underline"
                >
                  {file.uploadStatus === "SUCCESS" ? (
                    <div className="size-10 flex shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-accent" />
                  ) : file.uploadStatus === "PROCESSING" ? (
                    <div className="size-10 flex shrink-0 rounded-full border-4 border-dashed border-muted animate-spin animation-duration-[3s]" />
                  ) : (
                    <AlertCircle className="size-10 flex shrink-0 rounded-full text-danger/80 bg-danger/15" />
                  )}
                  <div className="flex-1 truncate">
                    <h5 className="truncate text-secondary-foreground">
                      {file.name}
                    </h5>
                  </div>
                </Link>
                <div className="grid grid-cols-3 gap-6 px-3 py-1 h-10 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Plus className="size-4" />
                    {format(new Date(file.createdAt), "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    {file.uploadStatus === "SUCCESS" ? (
                      <>
                        <MessageSquare className="size-4" /> {file.messageCount}
                      </>
                    ) : file.uploadStatus === "PROCESSING" ? (
                      <span className="text-info/75 flex flex-row gap-1.5 justify-end items-center">
                        <Loader2 className="size-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="text-danger/75 flex flex-row gap-1.5 justify-end items-center">
                        <AlertTriangle className="size-4" />
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="flex flex-row gap-1 justify-end items-center">
                    <>
                      <RenameFileDialog
                        file={file}
                        disabled={file.uploadStatus !== "SUCCESS"}
                      />
                      <DeleteFileDialog
                        file={file}
                        disabled={file.uploadStatus === "PROCESSING"}
                      />
                    </>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <ul className="ml-0 mt-8 mb-12 px-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton
            className="col-span-1 rounded-lg"
            borderRadius={10}
            inline={true}
            height={105}
            count={4}
          />
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="size-32 text-zinc-900" />
          <h4>Pretty empty over here...</h4>
          <p className="text-muted-foreground">Upload a PDF to get started!</p>
        </div>
      )}
    </main>
  );
}
