import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";

export interface InputProps extends ComponentProps<"input"> {
  icon?: ReactNode;
  iconTooltip?: string;
}

function Input({ className, type, icon, iconTooltip, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "border-bg-300 placeholder:text-fg-500 focus-visible:border-accent/50 focus-visible:ring-accent/35 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "rounded-sm border bg-transparent px-3 py-1 text-base font-light shadow-xs transition-[color,box-shadow,border-color] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "file:text-fg-100 h-9 w-full file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-light disabled:pointer-events-none",
          className
        )}
        {...props}
      />
      {icon && (
        <Tooltip>
          <TooltipTrigger className="absolute top-2.5 right-2.5 text-fg-500 [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0">
            {icon}
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>{iconTooltip}</span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export { Input };
