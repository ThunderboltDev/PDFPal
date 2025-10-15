"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { File } from "@/prisma/generated/prisma-client";
import ChatWrapper from "./chat/chat-wrapper";
import PDFRendererWrapper from "./pdf/pdf-renderer-wrapper";

interface FileViewProps {
  file: File;
  isSubscribed: boolean;
}

export default function FileView({ file, isSubscribed }: FileViewProps) {
  return (
    <div>
      <div className="hidden h-screen pt-14 md:flex">
        <ResizablePanelGroup
          className="h-full"
          direction="horizontal"
        >
          <ResizablePanel
            className="h-full"
            defaultSize={60}
            minSize={25}
          >
            <PDFRendererWrapper fileUrl={file.url} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            className="h-full"
            defaultSize={40}
            minSize={25}
          >
            <ChatWrapper
              fileId={file.id}
              isSheet={false}
              isSubscribed={isSubscribed}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="flex flex-col pt-14 md:hidden">
        <main>
          <PDFRendererWrapper fileUrl={file.url} />
        </main>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed right-5 bottom-5 rounded-full shadow-md"
              size="icon"
              variant="accent"
              onClick={() => {
                sendGAEvent("chat-action", {
                  value: 1,
                  action_name: "open-chat",
                  subscription_plan: isSubscribed ? "pro" : "free",
                });
              }}
            >
              <MessageCircleMore />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="!overflow-y-auto h-screen p-0"
            side="bottom"
          >
            <SheetTitle className="sr-only">Chat</SheetTitle>
            <div className="h-full">
              <ChatWrapper
                fileId={file.id}
                isSheet={true}
                isSubscribed={isSubscribed}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
