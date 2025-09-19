"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Expand, Loader2 } from "lucide-react";
import { useState } from "react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { toast } from "sonner";
import { useResizeDetector } from "react-resize-detector";

function Loader() {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex items-center justify-center bg-background/50 z-10 cursor-progress">
      <Loader2 className="animate-spin text-primary size-10" />
    </div>
  );
}

interface FullScreenProps {
  fileUrl: string;
}

export default function PDFFullScreen({ fileUrl }: FullScreenProps) {
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { width, ref: resizeContainerRef } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="gap-1.5"
          aria-label="Full screen"
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
              onLoadSuccess={({ numPages }) => {
                setNumberOfPages(numPages);
              }}
              onLoadError={() =>
                toast.error("Something went horribly wrong while loading PDF!")
              }
            >
              {new Array(numberOfPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  width={width ?? 1}
                  pageNumber={i + 1}
                  loading={<Loader />}
                  onRenderError={() => {
                    toast.error(`Error rendering page ${i + 1}!`);
                  }}
                />
              ))}
            </Document>
          </SimpleBar>
        </div>
      </DialogContent>
    </Dialog>
  );
}
