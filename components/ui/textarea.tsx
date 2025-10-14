import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			className={cn(
				"rounded-md border border-input bg-secondary px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
				"aria-invalid:border-danger aria-invalid:ring-danger/25",
				"field-sizing-content flex min-h-17 overflow-x-hidden",
				className,
			)}
			data-slot="textarea"
			{...props}
		/>
	);
}

export { Textarea };
