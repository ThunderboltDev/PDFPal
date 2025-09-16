"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type IndicatorColor =
  | "primary"
  | "accent"
  | "success"
  | "danger"
  | "info"
  | "warning";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  indicatorColor?: IndicatorColor;
}

const backgroundMap: Record<IndicatorColor, string> = {
  primary: "bg-primary/25",
  accent: "bg-accent/25",
  info: "bg-info/25",
  danger: "bg-danger/25",
  success: "bg-success/25",
  warning: "bg-warning/25",
} as const;

const gradientMap: Record<IndicatorColor, string> = {
  primary: "bg-shiny-primary",
  accent: "bg-shiny-accent",
  info: "bg-shiny-info",
  danger: "bg-shiny-danger",
  success: "bg-shiny-success",
  warning: "bg-shiny-warning",
} as const;

function Progress({
  className,
  value,
  indicatorColor = "primary",
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        backgroundMap[indicatorColor],
        `relative h-2 w-full overflow-hidden rounded-full`,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          gradientMap[indicatorColor],
          "h-full w-full flex-1 transition-all rounded-full",
          "bg-size-[300%_100%] animate-bg-position-x animation-duration-[1.5s]"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
