import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface TextareaProps extends ComponentProps<"textarea"> {
  maxRows?: number;
  minRows?: number;
}

function Textarea({
  className,
  minRows = 1,
  maxRows,
  ...props
}: TextareaProps) {
  return (
    <TextareaAutosize
      {...props}
      style={{}}
      data-slot="textarea"
      minRows={minRows}
      maxRows={maxRows}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-3 py-10 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
    />
  );
}

export { Textarea };
