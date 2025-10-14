import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			className={cn(
				"flex h-9 w-full min-w-0 rounded-md border border-input bg-secondary px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
				"aria-invalid:border-danger aria-invalid:text-danger aria-invalid:ring-danger/25 aria-invalid:placeholder:text-danger/60",
				"disabled:cursor-not-allowed",
				className,
			)}
			data-slot="input"
			type={type}
			{...props}
		/>
	);
}

export { Input };
