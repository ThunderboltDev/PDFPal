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
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-2 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-1 w-full flex-grow p-4">
            <div className="relative flex-grow">
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
                className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-3 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none pr-12 text-base py-2.5"
                autoFocus
              />
              <Button
                className={cn(
                  "size-9 rounded-sm absolute bottom-1.25 right-1.25",
                  {
                    "cursor-progress": isLoading || isChatLoading,
                  }
                )}
                type="button"
                variant="default"
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
                disabled={isLoading || isChatLoading}
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
