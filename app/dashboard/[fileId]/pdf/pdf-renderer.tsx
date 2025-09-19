"use client";

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  ZoomIn,
} from "lucide-react";

import { toast } from "sonner";
import { useEffect, useState } from "react";
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

function Loader() {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex items-center justify-center bg-background/50 z-10 cursor-progress">
      <Loader2 className="animate-spin text-primary size-10" />
    </div>
  );
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export interface PDFRendererProps {
  fileUrl: string;
}

export default function PDFRenderer({ fileUrl }: PDFRendererProps) {
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

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

  const { width, ref: resizeContainerRef } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 250,
  });

  const handlePageSubmit = ({ pageNumber }: PageNumberValidator) => {
    setCurrentPage(Number(pageNumber));
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPages) {
      setCurrentPage((prev) => prev + 1);
      setValue("pageNumber", String(currentPage + 1), { shouldValidate: true });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setValue("pageNumber", String(currentPage - 1), { shouldValidate: true });
    }
  };

  useEffect(() => {
    setIsRendering(true);
  }, [scale, rotation, currentPage]);

  return (
    <div className="w-full bg-background/50 rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-secondary flex items-center justify-between px-4">
        <form
          onSubmit={handleSubmit(handlePageSubmit)}
          className="flex items-center gap-2"
          aria-label="Page Navigation"
        >
          <Input
            {...register("pageNumber")}
            type="number"
            inputMode="numeric"
            placeholder={String(currentPage)}
            aria-invalid={!!errors.pageNumber}
            className="w-12 h-7 text-sm ml-2"
          />
          <p className="text-muted-foreground text-sm space-x-1">
            <span>/</span>
            <span>{numberOfPages || "?"}</span>
          </p>
          <Button
            size="icon"
            type="button"
            variant="ghost"
            aria-label="Next Page"
            disabled={!!numberOfPages && currentPage === numberOfPages}
            onClick={handleNextPage}
          >
            <ChevronUp className="size-4" />
            <span className="sr-only">Navigate to the next page</span>
          </Button>
          <Button
            size="icon"
            type="button"
            variant="ghost"
            aria-label="Previous Page"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            <ChevronDown className="size-4" />
            <span className="sr-only">Navigate to the previous page</span>
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

      <div
        className="flex-1 w-full max-h-screen"
        ref={resizeContainerRef}
      >
        <div className="h-full min-h-[calc(100vh-8rem)] relative">
          {isRendering && <Loader />}
          <SimpleBar className="max-h-[calc(100vh-8rem)]">
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
              <Page
                key="display-page"
                pageNumber={currentPage}
                width={width ?? 1}
                rotate={rotation}
                scale={scale}
                loading={<Loader />}
                onRenderSuccess={() => setIsRendering(false)}
                onRenderError={() => {
                  setIsRendering(false);
                  toast.error("Error rendering current page!");
                }}
              />
            </Document>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}
