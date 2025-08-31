import { Bot, User } from "lucide-react";

import Markdown from "react-markdown";
import { ExtendedMessage } from "@/types/message";
import { cn } from "@/lib/utils";

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
          "relative flex size-8 aspect-square items-center justify-center rounded-full",
          {
            "order-2 bg-primary": isUserMessage,
            "order-1 bg-purple-600": !isUserMessage,
            "invisible": isNextMessageSamePerson,
          }
        )}
      >
        {isUserMessage ? (
          <User className="size-5 text-zinc-100" />
        ) : (
          <Bot className="size-5 text-zinc-100" />
        )}
      </div>
      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": isUserMessage,
          "order-2 items-start": !isUserMessage,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg inline-block", {
            "bg-primary": isUserMessage,
            "bg-gray-100": !isUserMessage,
            "rounded-br-none": !isNextMessageSamePerson && isUserMessage,
            "rounded-bl-none": !isNextMessageSamePerson && !isUserMessage,
          })}
        >
          {typeof message.text === "string" ? (
            <div
              className={cn("max-w-prose", {
                "text-gray-100": isUserMessage,
              })}
            >
              <Markdown>{message.text}</Markdown>
            </div>
          ) : (
            message.text
          )}
        </div>
      </div>
    </div>
  );
}
