"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  Keyboard,
  Loader2,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

import "simplebar-react/dist/simplebar.min.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import PDFFullScreen from "./full-screen";

function Loader() {
  return (
    <div className="z-10 flex min-h-[calc(100vh-8rem)] w-full cursor-progress items-center justify-center bg-background/50">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  );
}

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export interface PDFRendererProps {
  fileUrl: string;
}

export default function PDFRenderer({ fileUrl }: PDFRendererProps) {
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simplebarRef = useRef<{
    getScrollElement?: () => HTMLElement | null;
  } | null>(null);
  const pageInputRef = useRef<HTMLInputElement | null>(null);

  const pageNumberValidator = z.object({
    pageNumber: z.string().refine(
      (value) => {
        const num = Number(value);
        if (Number.isNaN(num)) return false;
        if (numberOfPages && num > numberOfPages) return false;
        if (num < 1) return false;
        return true;
      },
      {
        error: "Invalid page number",
      }
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

  useHotkeys(
    ["pagedown", "space"],
    () => {
      handleNextPage();
    },
    [handleNextPage]
  );

  useHotkeys(
    ["pageup", "shift+space"],
    () => {
      handlePrevPage();
    },
    [handlePrevPage]
  );

  useHotkeys("home", () => {
    setCurrentPage(1);
    setValue("pageNumber", "1");
  });

  useHotkeys(
    "end",
    () => {
      setCurrentPage(numberOfPages);
      setValue("pageNumber", String(numberOfPages));
    },
    [numberOfPages]
  );

  useHotkeys("enter", () => {
    pageInputRef.current?.focus();
    pageInputRef.current?.select?.();
  });

  useHotkeys(["z"], () => {
    setScale((prev) => Math.min(Number((prev + 0.1).toFixed(2)), 2));
  });

  useHotkeys(["shift+z"], () => {
    setScale((prev) => Math.max(Number((prev - 0.1).toFixed(2)), 0.5));
  });

  useHotkeys("x", () => setScale(1));

  useHotkeys("r", () => {
    setRotation((prev) => (prev + 90) % 360);
  });

  useHotkeys("shift+r", () => {
    setRotation((prev) => (prev + 270) % 360);
  });

  return (
    <div
      className="flex h-full w-full flex-col items-center rounded-md"
      ref={containerRef}
    >
      <div className="flex flex-row w-full items-center justify-between border-border border-b bg-secondary px-4 py-2 overflow-x-auto overflow-y-hidden scrollbar-1">
        <form
          aria-label="Page Navigation"
          className="flex items-center gap-1"
          onSubmit={handleSubmit(handlePageSubmit)}
        >
          <Input
            {...register("pageNumber")}
            ref={pageInputRef}
            aria-invalid={!!errors.pageNumber}
            className="ml-2 h-7 w-12 text-sm"
            inputMode="numeric"
            placeholder={String(currentPage)}
            min={1}
            max={numberOfPages}
            type="number"
          />
          <p className="mr-2 ml-1 space-x-1 text-muted-foreground text-sm">
            <span>/</span>
            <span>{numberOfPages || "?"}</span>
          </p>
          <Button
            aria-label="Next Page"
            disabled={!!numberOfPages && currentPage === numberOfPages}
            onClick={handleNextPage}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronDown className="size-4" />
            <span className="sr-only">Navigate to the next page</span>
          </Button>
          <Button
            aria-label="Previous Page"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronUp className="size-4" />
            <span className="sr-only">Navigate to the previous page</span>
          </Button>
        </form>

        <div className="flex flex-row gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Zoom"
                className="gap-1.5"
                variant="ghost"
              >
                <ZoomIn className="size-4" />
                {(scale * 100).toFixed(0)}%<span className="sr-only">Zoom</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setScale(1)}>
                50%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                75%
              </DropdownMenuItem>
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
            aria-label="Rotate 90 degrees clockwise"
            onClick={() => setRotation((prev) => prev + 90)}
            size="icon"
            variant="ghost"
          >
            <RotateCw className="size-4" />
            <span className="sr-only">Rotate 90 degress clockwise</span>
          </Button>

          <PDFFullScreen fileUrl={fileUrl} />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                aria-label="Show keyboard shortcuts"
                className="gap-1.5"
                size="icon"
                type="button"
                variant="ghost"
              >
                <Keyboard className="size-4" />
                <span className="sr-only">Keyboard Shortcuts</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogTitle>Keyboard shortcuts</DialogTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Available keyboard shortcuts for PDF navigation and controls
                  </caption>
                  <thead className="text-muted-foreground text-base md:text-sm">
                    <tr>
                      <th
                        scope="col"
                        className="py-2 pr-4"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="py-2"
                      >
                        Shortcut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 pr-4">Next page</td>
                      <td className="py-1">
                        <KbdGroup>
                          <Kbd>PageDown</Kbd>
                          <span className="text-muted-foreground">or</span>
                          <Kbd>Space</Kbd>
                        </KbdGroup>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Previous page</td>
                      <td className="py-1">
                        <KbdGroup>
                          <Kbd>PageUp</Kbd>
                          <span className="text-muted-foreground">or</span>
                          <KbdGroup>
                            <Kbd>Shift</Kbd>
                            <span>+</span>
                            <Kbd>Space</Kbd>
                          </KbdGroup>
                        </KbdGroup>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Jump to top (first page)</td>
                      <td className="py-1">
                        <Kbd>Home</Kbd>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Jump to bottom (last page)</td>
                      <td className="py-1">
                        <Kbd>End</Kbd>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Focus page input</td>
                      <td className="py-1">
                        <Kbd>Enter</Kbd>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Zoom in</td>
                      <td className="py-1">
                        <Kbd>Z</Kbd>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Zoom out</td>
                      <td className="py-1">
                        <Kbd>Shift</Kbd>
                        <span>+</span>
                        <Kbd>Z</Kbd>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Reset zoom</td>
                      <td className="py-1">
                        <Kbd>X</Kbd>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Rotate clockwise</td>
                      <td className="py-1">
                        <Kbd>R</Kbd>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">Rotate counter-clockwise</td>
                      <td className="py-1">
                        <Kbd>Shift</Kbd>
                        <span>+</span>
                        <Kbd>R</Kbd>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div
        className="h-full w-full flex-1"
        ref={resizeContainerRef}
      >
        <div className="relative h-full">
          <SimpleBar
            className="h-[calc(100vh-14*8px)]"
            ref={(instance) => {
              simplebarRef.current = instance;
            }}
          >
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
              <Page
                loading={<Loader />}
                onRenderError={() => {
                  toast.error("Error rendering current page!");
                }}
                pageNumber={currentPage}
                rotate={rotation}
                scale={scale}
                width={width ?? 1}
              />
            </Document>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}
