"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ChevronDown,
	ChevronUp,
	Loader2,
	RotateCw,
	ZoomIn,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

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

	const pageNumberValidator = z.object({
		pageNumber: z.string().refine(
			(value) => {
				const num = Number(value);
				if (Number.isNaN(num)) return false;
				if (numberOfPages && num > numberOfPages) return false;
				if (num < 1) return false;
				return true;
			},
			{ error: "Invalid page number" },
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

	return (
		<div className="flex h-full w-full flex-col items-center rounded-md">
			<div className="flex w-full items-center justify-between border-border border-b bg-secondary px-4 py-2">
				<form
					aria-label="Page Navigation"
					className="flex items-center gap-1"
					onSubmit={handleSubmit(handlePageSubmit)}
				>
					<Input
						{...register("pageNumber")}
						aria-invalid={!!errors.pageNumber}
						className="ml-2 h-7 w-12 text-sm"
						inputMode="numeric"
						placeholder={String(currentPage)}
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
						<ChevronUp className="size-4" />
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
						<ChevronDown className="size-4" />
						<span className="sr-only">Navigate to the previous page</span>
					</Button>
				</form>

				<div className="space-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button aria-label="Zoom" className="gap-1.5" variant="ghost">
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
						aria-label="Rotate 90 degrees clockwise"
						onClick={() => setRotation((prev) => prev + 90)}
						size="icon"
						variant="ghost"
					>
						<RotateCw className="size-4" />
						<span className="sr-only">Rotate 90 degress clockwise</span>
					</Button>

					<PDFFullScreen fileUrl={fileUrl} />
				</div>
			</div>

			<div className="h-full w-full flex-1" ref={resizeContainerRef}>
				<div className="relative h-full">
					{/* {isRendering && <Loader />} */}
					<SimpleBar className="h-[calc(100vh-14*8px)]">
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
								key="display-page"
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
