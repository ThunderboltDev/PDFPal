"use client";

import { ChevronLeft, XCircle, Zap } from "lucide-react";

import { trpc } from "@/app/_trpc/client";
import Loader from "@/components/ui/loader";
import { LinkButton } from "@/components/ui/button";

import Messages from "./messages";
import ChatInput from "./chat-input";
import ChatContextProvider from "./chat-context";
import config from "@/config";

const plans = config.plans;

interface ChatWrapperProps {
  fileId: string;
  isSubscribed: boolean;
}

export default function ChatWrapper({
  fileId,
  isSubscribed,
}: ChatWrapperProps) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
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
      <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center items-center">
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
      <div className="relative w-full min-h-full flex divide-y divide-secondary flex-col justify-between gap-2">
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
