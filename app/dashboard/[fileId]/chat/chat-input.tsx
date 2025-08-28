import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  isLoading: boolean;
}

export default function ChatInput({ isLoading }: ChatInputProps) {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-2 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-1 w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                placeholder="Chat with your PDF"
                className="resize-none pr-12 text-base py-3"
                autoFocus
              />
              <Button
                // size="icon"
                variant="default"
                aria-label="Send message"
              >
                <Send className="size-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
