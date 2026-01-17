"use client";

import { Bot, User } from "lucide-react";
import type { ExtendedMessage } from "@/lib/types/message";
import { cn } from "@/lib/utils";

import MessageMarkdown from "./message-md";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

export default function Message({
  message,
  isNextMessageSamePerson,
}: MessageProps) {
  const { isUserMessage } = message;
  return (
    <div
      className={cn("flex items-end", {
        "justify-end": isUserMessage,
      })}
    >
      <div
        className={cn(
          "relative flex aspect-square size-8 items-center justify-center rounded-full shadow-sm",
          {
            "order-2 bg-primary": isUserMessage,
            "order-1 bg-accent": !isUserMessage,
            invisible: isNextMessageSamePerson,
          }
        )}
      >
        {isUserMessage ? (
          <User className="size-5 text-muted" />
        ) : (
          <Bot className="size-5 text-muted" />
        )}
      </div>
      <div
        className={cn(
          "mx-2 flex flex-col space-y-2 text-base md:max-w-[calc(100%-87px)]",
          {
            "order-1 items-end": isUserMessage,
            "order-2 items-start": !isUserMessage,
          }
        )}
      >
        <div
          className={cn(
            "inline-block max-w-[min(100vw-87px,36rem)] text-wrap rounded-lg px-4 py-2 shadow-md md:max-w-full md:text-sm",
            {
              "bg-primary text-primary-foreground": isUserMessage,
              "bg-secondary text-secondary-foreground": !isUserMessage,
              "rounded-br-none": !isNextMessageSamePerson && isUserMessage,
              "rounded-bl-none": !(isNextMessageSamePerson || isUserMessage),
            }
          )}
        >
          {typeof message.text === "string" ? (
            <MessageMarkdown>{message.text}</MessageMarkdown>
          ) : (
            message.text
          )}
        </div>
      </div>
    </div>
  );
}
