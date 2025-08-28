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
interface FullScreenProps {
  fileUrl: string;
}

export default function PDFFullScreen({ fileUrl }: FullScreenProps) {
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { width, ref } = useResizeDetector();

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
      <DialogContent className="container-7xl">
        <DialogTitle>PDF Full Screen</DialogTitle>
        <SimpleBar
          autoHide={false}
          className="max-h-[calc(100vh-10rem)] mt-6"
        >
          <div ref={ref}>
            <Document
              className="max-h-full"
              loading={
                <div className="flex justify-center py-[calc(50vh-6rem)]">
                  <Loader2 className="size-6 animate-spin my-auto" />
                </div>
              }
              onLoadSuccess={(document) => {
                setNumberOfPages(document.numPages);
              }}
              onLoadError={() => toast.error("Something went horribly wrong!")}
              file={fileUrl}
            >
              {new Array(numberOfPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  width={width ?? 1}
                  pageNumber={i + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}
