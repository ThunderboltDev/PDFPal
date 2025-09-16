"use client";

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  ZoomIn,
} from "lucide-react";

import { toast } from "sonner";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import "simplebar-react/dist/simplebar.min.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PDFFullScreen from "./full-screen";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export interface PDFRendererProps {
  fileUrl: string;
}

export default function PDFRenderer({ fileUrl }: PDFRendererProps) {
  const [numberOfPages, setNumberOfPages] = useState<number | null>(null);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  const isLoading = renderedScale !== scale;

  const pageNumberValidator = z.object({
    pageNumber: z.string().refine(
      (value) => {
        const num = Number(value);
        if (Number.isNaN(num)) return false;
        if (numberOfPages && num > numberOfPages) return false;
        if (num < 1) return false;
        return true;
      },
      { error: "Invalid page number" }
    ),
  });

  type PageNumberValidator = z.infer<typeof pageNumberValidator>;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PageNumberValidator>({
    defaultValues: {
      pageNumber: "1",
    },
    resolver: zodResolver(pageNumberValidator),
    mode: "onChange",
  });

  const { width, ref } = useResizeDetector();

  const handlePageNumberSubmit = ({ pageNumber }: PageNumberValidator) => {
    setCurrentPage(Number(pageNumber));
    setValue("pageNumber", pageNumber);
  };

  return (
    <div className="w-full bg-background rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <form
          onSubmit={handleSubmit(handlePageNumberSubmit)}
          className="flex items-center gap-1.5"
          aria-label="Page Navigation"
        >
          <Button
            size="icon"
            type="button"
            variant="ghost"
            aria-label="Previous Page"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
              setValue("pageNumber", String(currentPage - 1));
            }}
          >
            <ChevronDown className="size-4" />
            <span className="sr-only">Navigate to the previous page</span>
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("pageNumber")}
              type="number"
              inputMode="numeric"
              placeholder={String(currentPage)}
              aria-invalid={!!errors.pageNumber}
              className="w-12 h-7 text-sm"
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numberOfPages ?? "?"}</span>
            </p>
          </div>
          <Button
            size="icon"
            type="button"
            variant="ghost"
            aria-label="Next Page"
            disabled={!!numberOfPages && currentPage === numberOfPages}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              setValue("pageNumber", String(currentPage + 1));
            }}
          >
            <ChevronUp className="size-4" />
            <span className="sr-only">Navigate to the next page</span>
          </Button>
        </form>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                aria-label="Zoom"
                className="gap-1.5"
              >
                <ZoomIn className="size-4" />
                {scale * 100}%<span className="sr-only">Zoom</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.25)}>
                125%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.75)}>
                175%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            size="icon"
            variant="ghost"
            aria-label="Rotate 90 degrees clockwise"
          >
            <RotateCw className="size-4" />
            <span className="sr-only">Rotate 90 degress clockwise</span>
          </Button>

          <PDFFullScreen fileUrl={fileUrl} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar
          autoHide={false}
          className="max-h-[calc(100vh-10rem)]"
        >
          <div ref={ref}>
            <Document
              className="max-h-full"
              loading={
                <div className="flex justify-center py-[calc(50vh-10rem)]">
                  <Loader2 className="size-6 animate-spin my-auto" />
                </div>
              }
              onLoadSuccess={(document) => {
                setNumberOfPages(document.numPages);
              }}
              onLoadError={() => toast.error("Something went horribly wrong!")}
              file={fileUrl}
            >
              {isLoading && !!renderedScale && (
                <Page
                  key="fallback-page"
                  pageNumber={currentPage}
                  width={width ?? 1}
                  rotate={rotation}
                  scale={scale}
                />
              )}

              <Page
                key="display-page"
                className={cn(isLoading ? "hidden" : "")}
                pageNumber={currentPage}
                width={width ?? 1}
                rotate={rotation}
                scale={scale}
                loading={
                  <div className="flex justify-center py-[calc(50vh-10rem)]">
                    <Loader2 className="size-6 animate-spin my-auto" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
