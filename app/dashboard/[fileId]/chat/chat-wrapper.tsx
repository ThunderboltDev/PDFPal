"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "./chat-input";
import Messages from "./messages";
import Loader from "@/components/ui/loader";
import { ChevronLeft, XCircle, Zap } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ChatContextProvider from "./chat-context";

interface ChatWrapperProps {
  fileId: string;
}

export default function ChatWrapper({ fileId }: ChatWrapperProps) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (query) => {
        return query.state.data?.status === "SUCCESS" ||
          query.state.data?.status === "FAILED"
          ? false
          : 500;
      },
    }
  );

  if (data?.status === "FAILED") {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
        <XCircle className="size-16 text-destructive/90" />
        <div className="text-center mt-4">
          <h4>Too many pages</h4>
          <p className="text-muted-foreground text-sm mt-1">
            Your <span className="font-semibold">Free Plan</span> supports up to
            5 pages per PDF
          </p>
          <div className="flex flex-col gap-2 mt-4 w-48 mx-auto">
            <Link
              href="/pricing#pro-plan"
              className={buttonVariants({ variant: "default" })}
            >
              <Zap className="size-4" />
              Upgrade to Pro Plan
            </Link>
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "secondary" })}
            >
              <ChevronLeft className="size-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        {isLoading ? (
          <Loader>
            <h4>Loading...</h4>
            <p className="text-muted-foreground text-sm">
              Prepraring your PDF file
            </p>
          </Loader>
        ) : data?.status === "PROCESSING" ? (
          <Loader>
            <h4>Processing...</h4>
            <p className="text-muted-foreground text-sm">
              Processing your PDF file
            </p>
          </Loader>
        ) : (
          <div className="flex-1 justify-between flex flex-col mb-28">
            <Messages fileId={fileId} />
          </div>
        )}
        <ChatInput isLoading={isLoading} />
      </div>
    </ChatContextProvider>
  );
}
