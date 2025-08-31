import { Loader2, MessageSquare } from "lucide-react";

import { useContext, useEffect, useRef } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";

import { trpc } from "@/app/_trpc/client";
import Skeleton from "@/components/ui/skeleton";
import { ChatContext } from "./chat-context";
import Message from "./message";
import { cn } from "@/lib/utils";

interface MessagesProps {
  fileId: string;
}

export default function Messages({ fileId }: MessagesProps) {
  const { isLoading: isThinking } = useContext(ChatContext);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        placeholderData: keepPreviousData,
      }
    );

  useEffect(() => console.log("pages", data?.pages), [data]);

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
      <span className="flex h-full items-center justify-center cursor-progress">
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
      ref={containerRef}
      className={cn(
        "flex flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto",
        "max-h-[calc(100vh-10.5rem)] border-zinc-200",
        {
          "cursor-pointer": isLoading,
        }
      )}
    >
      {mergedMessages && mergedMessages.length > 0 ? (
        mergedMessages.map((message, index) => {
          const isNextMessageSamePerson =
            mergedMessages[index - 1]?.isUserMessage ===
            mergedMessages[index]?.isUserMessage;
          return (
            <Message
              key={message.id}
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
            />
          );
        })
      ) : isLoading ? (
        new Array(10).fill(0).map((_, index) => (
          <Message
            key={index}
            isNextMessageSamePerson={false}
            aria-label="Loading conversation"
            message={{
              id: String(index),
              isUserMessage: index % 2 === 1,
              text: (
                <Skeleton
                  width={(containerRef.current?.clientWidth ?? 100) * 0.65}
                  className={cn({
                    "opacity-30": index % 2 === 1,
                  })}
                  count={Math.floor(
                    Math.random() * (index % 2 === 1 ? 2 : 4) + 1
                  )}
                />
              ),
            }}
          />
        ))
      ) : (
        <div className="flex-2 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="size-24 text-primary" />
          <h4>You&apos;re all set!</h4>
          <p className="text-sm text-muted-foreground">
            Ask your first question to get started
          </p>
        </div>
      )}
      {hasNextPage && (
        <div
          className="mt-4 mb-6 flex justify-center items-center cursor-progress"
          aria-label="Loading conversation"
          title="Loading conversation"
        >
          <Loader2 className="size-6 animate-spin" />
        </div>
      )}
      <div ref={intersectionRef} />
    </div>
  );
}
