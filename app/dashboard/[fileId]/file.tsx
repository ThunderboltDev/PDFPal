"use client";

import { MessageCircleMore } from "lucide-react";
import { File } from "@/prisma/generated/prisma-client";

import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import ChatWrapper from "./chat/chat-wrapper";
import PDFRendererWrapper from "./pdf/pdf-renderer-wrapper";

interface FileViewProps {
  file: File;
  isSubscribed: boolean;
}

export default function FileView({ file, isSubscribed }: FileViewProps) {
  return (
    <div>
      <div className="hidden md:flex pt-14 h-screen">
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
              isSubscribed={isSubscribed}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="flex flex-col md:hidden pt-14">
        <main>
          <PDFRendererWrapper fileUrl={file.url} />
        </main>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="accent"
              className="fixed bottom-5 right-5 rounded-full shadow-md"
            >
              <MessageCircleMore />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[100vh] p-0"
          >
            <SheetTitle className="sr-only">Chat</SheetTitle>
            <ChatWrapper
              fileId={file.id}
              isSubscribed={isSubscribed}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
