"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Ghost,
  Loader2,
  MessageSquare,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteFileDialog, RenameFileDialog } from "./dialogs";
import UploadButton from "./upload-button";

export default function Dashboard() {
  const { data: files, isLoading } = trpc.file.getUserFiles.useQuery();
  const { data: subscriptionPlan } =
    trpc.subscription.getUserSubscriptionPlan.useQuery();

  return (
    <main className="container-7xl pt-20">
      <div className="flex flex-col items-start justify-between gap-3 pb-5 xs:pb-3 xs:flex-row xs:items-center xs:gap-0">
        <h2>My Files</h2>
        <UploadButton
          isLoading={!subscriptionPlan}
          isSubscribed={!!subscriptionPlan?.isSubscribed}
        />
      </div>
      <Separator />
      {files && files.length !== 0 ? (
        <ul className="mt-8 mb-12 ml-0 grid grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                className="col-span-1 divide-y divide-border rounded-lg bg-secondary shadow-md transition hover:shadow-lg"
                key={file.id}
              >
                <Link
                  className="flex items-center justify-center gap-3 px-4 py-3 no-underline"
                  href={`/dashboard/${file.id}`}
                  onClick={() =>
                    sendGTMEvent({
                      value: 1,
                      event: "dashboard_action",
                      action: "file_click",
                      subscription_plan: subscriptionPlan?.name,
                    })
                  }
                >
                  {file.uploadStatus === "SUCCESS" ? (
                    <div className="flex size-10 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-accent" />
                  ) : file.uploadStatus === "PROCESSING" ? (
                    <div className="animation-duration-[3s] flex size-10 shrink-0 animate-spin rounded-full border-4 border-muted border-dashed" />
                  ) : (
                    <AlertCircle className="flex size-10 shrink-0 rounded-full bg-danger/15 text-danger/80" />
                  )}
                  <div className="flex-1 truncate">
                    <h5 className="truncate text-secondary-foreground">
                      {file.name}
                    </h5>
                  </div>
                </Link>
                <div className="grid h-10 grid-cols-3 gap-6 px-3 py-1 text-muted-foreground text-xs">
                  <div className="flex items-center gap-1.5">
                    <Plus className="size-4" />
                    {format(file.createdAt, "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    {file.uploadStatus === "SUCCESS" ? (
                      <>
                        <MessageSquare className="size-4" /> {file.messageCount}
                      </>
                    ) : file.uploadStatus === "PROCESSING" ? (
                      <span className="flex flex-row items-center justify-end gap-1.5 text-info/75">
                        <Loader2 className="size-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex flex-row items-center justify-end gap-1.5 text-danger/75">
                        <AlertTriangle className="size-4" />
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-end gap-1">
                    <RenameFileDialog
                      subscriptionPlan={subscriptionPlan?.name}
                      disabled={file.uploadStatus !== "SUCCESS"}
                      file={file}
                    />
                    <DeleteFileDialog
                      subscriptionPlan={subscriptionPlan?.name}
                      disabled={file.uploadStatus === "PROCESSING"}
                      file={file}
                    />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <ul className="mt-8 mb-12 ml-0 grid grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton
            borderRadius={10}
            className="col-span-1 rounded-lg"
            count={4}
            height={105}
            inline
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
