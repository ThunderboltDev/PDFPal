"use client";

import { ChevronLeft, XCircle, Zap } from "lucide-react";

import { trpc } from "@/app/_trpc/client";
import Loader from "@/components/ui/loader";
import { LinkButton } from "@/components/ui/button";
import config from "@/config";

import ChatContextProvider from "./chat-context";
import ChatInput from "./chat-input";
import Messages from "./messages";

const plans = config.plans;

interface ChatWrapperProps {
  fileId: string;
  isSubscribed: boolean;
}

export default function ChatWrapper({
  fileId,
  isSubscribed,
}: ChatWrapperProps) {
  const { data, isLoading } = trpc.file.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (query) => {
        return query.state.data?.status !== "PROCESSING" ? false : 500;
      },
    }
  );

  const plan = isSubscribed ? "pro" : "free";

  if (data?.status.includes("FAILED")) {
    return (
      <div className="min-h-full flex flex-col justify-center items-center">
        <XCircle className="size-16 text-danger" />
        <div className="text-center mt-4">
          <h4>Processing Failed</h4>
          {data.status}
          <p className="text-muted-foreground text-sm mt-1 mx-2">
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
          <div className="flex flex-col gap-2.5 mt-4 w-48 mx-auto">
            {!isSubscribed && data.status !== "FAILED_UNKNOWN" && (
              <LinkButton
                href="/pricing#pro-plan"
                variant="accent"
              >
                <Zap className="size-4" />
                Upgrade to Pro Plan
              </LinkButton>
            )}
            <LinkButton
              href="/dashboard"
              variant="default"
            >
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
      <div className="relative w-full h-full flex flex-col">
        <div className="flex-1 min-h-0">
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
            <Messages fileId={fileId} />
          )}
        </div>
        <div className="flex-shrink-0 border-t border-border bg-secondary">
          <ChatInput isLoading={isLoading} />
        </div>
      </div>
    </ChatContextProvider>
  );
}
