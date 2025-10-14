"use client";

import dynamic from "next/dynamic";
import type { PDFRendererProps } from "./pdf-renderer";

const PDFRenderer = dynamic(() => import("./pdf-renderer"), { ssr: false });

export default function PDFRendererWrapper({ fileUrl }: PDFRendererProps) {
	return <PDFRenderer fileUrl={fileUrl} />;
}
