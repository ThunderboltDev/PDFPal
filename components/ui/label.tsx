"use client";

import { ComponentProps } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface LabelProps extends ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean;
}

function Label({ className, required = false, ...props }: LabelProps) {
  return (
    <div className="relative inline-flex items-center gap-0 group">
      <LabelPrimitive.Root
        data-slot="label"
        className={cn(
          "flex items-center gap-2 md:text-sm leading-none font-normal select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
        {...props}
      />
      <div className="absolute -top-1 -right-3.5 size-3.5">
        {required && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Asterisk className="text-destructive size-3.5 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="translate-y-1">
              <span>This field is required</span>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export { Label };
