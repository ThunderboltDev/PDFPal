"use client";

import { ChevronLeft, XCircle, Zap } from "lucide-react";

import { trpc } from "@/app/_trpc/client";
import { LinkButton } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import config from "@/config";
import ChatContextProvider from "./chat-context";
import ChatInput from "./chat-input";
import Messages from "./messages";

const plans = config.plans;

interface ChatWrapperProps {
  fileId: string;
  isSheet: boolean;
  isSubscribed: boolean;
}

export default function ChatWrapper({
  fileId,
  isSheet,
  isSubscribed,
}: ChatWrapperProps) {
  const { data, isLoading } = trpc.file.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (query) =>
        query.state.data?.status !== "PROCESSING" ? false : 500,
    },
  );

  const plan = isSubscribed ? "pro" : "free";

  if (data?.status.includes("FAILED")) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center">
        <XCircle className="size-16 text-danger" />
        <div className="mt-4 text-center">
          <h4>Processing Failed</h4>
          <p className="mx-2 mt-1 text-muted-foreground text-base text-balance">
            {data.status === "FAILED_TOO_LARGE" ? (
              isSubscribed ? (
                <>
                  Your PDF is too large. Please try uploading a smaller document
                  (&lt;= {plans[plan].maxFileSize}).
                </>
              ) : (
                <>
                  Your PDF is too large (&gt; {plans[plan].maxFileSize}). Please
                  upgrade to the Pro plan to upload larger documents.
                </>
              )
            ) : data.status === "FAILED_TOO_MANY_PAGES" ? (
              isSubscribed ? (
                <>
                  Your PDF has too many pages. Please try uploading a smaller
                  document (&lt;= {plans[plan].maxPages} pages).
                </>
              ) : (
                <>
                  Your PDF has too many pages (&gt; {plans[plan].maxPages}{" "}
                  pages). Please upgrade to the Pro plan to upload larger
                  documents.
                </>
              )
            ) : (
              <>
                Something went wrong while processing your PDF file. Please try
                again later!
              </>
            )}
          </p>
          <div className="mx-auto mt-4 flex w-48 flex-col gap-2.5">
            {!isSubscribed && data.status !== "FAILED_UNKNOWN" && (
              <LinkButton href="/pricing#pro-plan" variant="accent">
                <Zap className="size-4" />
                Upgrade to Pro Plan
              </LinkButton>
            )}
            <LinkButton href="/dashboard" variant="default">
              <ChevronLeft className="size-4" />
              Back to Dashboard
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative flex h-full w-full flex-col">
        <div className="min-h-0 flex-1">
          {isLoading ? (
            <Loader />
          ) : data?.status === "PROCESSING" ? (
            <Loader>
              <h4>Processing...</h4>
              <p className="text-muted-foreground text-sm">
                Processing your PDF file
              </p>
            </Loader>
          ) : isSheet ? (
            <ScrollArea className="h-full" onWheel={(e) => e.stopPropagation()}>
              <Messages fileId={fileId} />
            </ScrollArea>
          ) : (
            <Messages fileId={fileId} />
          )}
        </div>
        <div className="flex-shrink-0 border-border border-t bg-secondary">
          <ChatInput isLoading={isLoading} />
        </div>
      </div>
    </ChatContextProvider>
  );
}
