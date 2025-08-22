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
        className={cn("input", className)}
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
