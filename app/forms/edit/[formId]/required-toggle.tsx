"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Asterisk } from "lucide-react";

import { cn } from "@/lib/utils";

function RequiredToggle({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer text-fg-100 data-[state="checked"]:text-bg-100 border-none rounded-full bg-bg-300 data-[state="checked"]:bg-primary-600 focus-visible:ring-bg-300/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 size-4 shrink-0 shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center transition-none">
        <Asterisk className="size-3.5 text-current" />
      </div>
    </CheckboxPrimitive.Root>
  );
}

export { RequiredToggle };
