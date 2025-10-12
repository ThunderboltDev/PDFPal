import { useContext, KeyboardEvent, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChatContext } from "./chat-context";
import { cn } from "@/lib/utils";

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
    if (!isLoading && !isChatLoading && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addMessage();
      inputRef.current?.focus();
    }
  };

  return (
    <form className="relative p-3 mx-auto min-w-md max-w-lg md:min-w-0">
      <TextareaAutosize
        ref={inputRef}
        data-slot="textarea"
        placeholder="Chat with your PDF"
        rows={1}
        minRows={1}
        maxRows={4}
        value={message}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        className="w-full border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content rounded-lg border bg-secondary shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none pl-3 pr-12 text-base py-2.5"
        autoFocus
      />
      <Button
        className={cn("absolute bottom-4.25 right-4.25 md:size-8", {
          "cursor-progress": isLoading || isChatLoading,
        })}
        type="button"
        variant="primary"
        size="icon"
        aria-label={
          isLoading
            ? "Loading"
            : isChatLoading
            ? "Loading chat"
            : "Send message"
        }
        onClick={() => {
          addMessage();
          inputRef.current?.focus();
        }}
        disabled={isLoading || isChatLoading || !message.trim()}
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
