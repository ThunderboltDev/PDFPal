"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { Expand, Loader2 } from "lucide-react";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Loader() {
  return (
    <div className="z-10 flex min-h-[calc(100vh-8rem)] w-full cursor-progress items-center justify-center bg-background/50">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  );
}

interface FullScreenProps {
  fileUrl: string;
}

export default function PDFFullScreen({ fileUrl }: FullScreenProps) {
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { width, ref: resizeContainerRef } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 300,
  });

  return (
    <Dialog
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button
          aria-label="Full screen"
          className="gap-1.5"
          size="icon"
          variant="ghost"
          onClick={() => {
            sendGTMEvent({
              event: "pdf_action",
              action: "toggle_full_screen",
              value: 1,
            });
          }}
        >
          <Expand className="size-4" />
          <span className="sr-only">Full screen</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[calc(100%-3rem)]">
        <DialogTitle>PDF Full Screen</DialogTitle>
        <div ref={resizeContainerRef}>
          <SimpleBar className="max-h-[calc(100vh-8rem)] max-w-full">
            <Document
              file={fileUrl}
              loading={<Loader />}
              onLoadError={() =>
                toast.error("Something went horribly wrong while loading PDF!")
              }
              onLoadSuccess={({ numPages }) => {
                setNumberOfPages(numPages);
              }}
            >
              {new Array(numberOfPages).fill(0).map((_, index) => (
                <Page
                  key={uuidv4()}
                  loading={<Loader />}
                  onRenderError={() => {
                    toast.error(`Error rendering page ${index + 1}!`);
                  }}
                  pageNumber={index + 1}
                  width={width ?? 1}
                />
              ))}
            </Document>
          </SimpleBar>
        </div>
      </DialogContent>
    </Dialog>
  );
}
