"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { Loader2, Send } from "lucide-react";
import { type KeyboardEvent, useContext, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatContext } from "./chat-context";

interface ChatInputProps {
  isLoading: boolean;
}

export default function ChatInput({ isLoading }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    handleInputChange,
    addMessage,
    isLoading: isChatLoading,
    message,
  } = useContext(ChatContext);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(isLoading || isChatLoading) && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addMessage();

      inputRef.current?.focus();

      sendGTMEvent({
        event: "chat_action",
        action: "message_sent",
        value: 1,
      });
    }
  };

  return (
    <form className="relative mx-auto sm:min-w-md max-w-lg p-3 md:min-w-0">
      <TextareaAutosize
        autoFocus
        className="field-sizing-content flex w-full resize-none rounded-lg border border-input bg-secondary py-2.5 pr-12 pl-3 text-base shadow-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40"
        data-slot="textarea"
        rows={1}
        maxRows={4}
        minRows={1}
        maxLength={500}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Chat with your PDF"
        ref={inputRef}
        value={message}
      />
      <Button
        aria-label={
          isLoading
            ? "Loading"
            : isChatLoading
            ? "Loading chat"
            : "Send message"
        }
        className={cn("absolute right-4.25 bottom-4.25 md:size-8", {
          "cursor-progress": isLoading || isChatLoading,
        })}
        disabled={isLoading || isChatLoading || !message.trim()}
        onClick={() => {
          addMessage();
          inputRef.current?.focus();
        }}
        size="icon"
        type="button"
        variant="primary"
      >
        {isLoading || isChatLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        <span className="sr-only">
          {isLoading
            ? "Loading"
            : isChatLoading
            ? "Loading chat"
            : "Send message"}
        </span>
      </Button>
    </form>
  );
}
