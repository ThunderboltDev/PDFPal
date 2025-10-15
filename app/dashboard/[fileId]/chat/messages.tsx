import { useIntersection } from "@mantine/hooks";
import { keepPreviousData } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { trpc } from "@/app/_trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChatContext } from "./chat-context";
import Message from "./message";

interface MessagesProps {
  fileId: string;
}

export default function Messages({ fileId }: MessagesProps) {
  const { isLoading: isThinking } = useContext(ChatContext);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage } =
    trpc.chat.getFileMessages.useInfiniteQuery(
      {
        fileId,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        placeholderData: keepPreviousData,
      }
    );

  const { ref: intersectionRef, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) fetchNextPage();
  }, [entry, hasNextPage, fetchNextPage]);

  const loadingMessage = {
    id: "loading-message",
    createdAt: new Date(),
    isUserMessage: false,
    text: (
      <span className="flex h-full cursor-progress items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </span>
    ),
  };

  const messages = data?.pages.flatMap((page) => page.messages);

  const mergedMessages = [
    ...(isThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div
      className={cn(
        "mb-2 flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3",
        {
          "cursor-pointer": isLoading,
        }
      )}
      ref={containerRef}
    >
      {mergedMessages && mergedMessages.length > 0 ? (
        mergedMessages.map((message, index) => {
          const isNextMessageSamePerson =
            mergedMessages[index - 1]?.isUserMessage ===
            mergedMessages[index]?.isUserMessage;
          return (
            <Message
              isNextMessageSamePerson={isNextMessageSamePerson}
              key={message.id}
              message={message}
            />
          );
        })
      ) : isLoading ? (
        new Array(10).fill(0).map((_, index) => (
          <Message
            aria-label="Loading conversation"
            isNextMessageSamePerson={false}
            key={uuidv4()}
            message={{
              id: String(index),
              isUserMessage: index % 2 === 1,
              text: (
                <Skeleton
                  count={Math.floor(
                    Math.random() * (index % 2 === 1 ? 2 : 4) + 1
                  )}
                  variant={index % 2 === 1 ? "muted" : "default"}
                  width={(containerRef.current?.clientWidth ?? 100) * 0.65}
                />
              ),
            }}
          />
        ))
      ) : (
        <div className="flex flex-2 flex-col min-h-[calc(100vh-12rem)] items-center justify-center gap-2">
          <MessageSquare className="size-24 text-primary" />
          <h4>You&apos;re all set!</h4>
          <p className="text-muted-foreground text-sm text-center">
            Ask your first question to get started
          </p>
        </div>
      )}
      {hasNextPage && (
        <div
          className="mt-4 mb-6 flex cursor-progress items-center justify-center"
          title="Loading conversation"
        >
          <Loader2
            className="size-6 animate-spin"
            aria-label="Loading conversation"
          />
        </div>
      )}
      <div ref={intersectionRef} />
    </div>
  );
}
