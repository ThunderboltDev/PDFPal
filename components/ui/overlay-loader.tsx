import { Loader2 } from "lucide-react";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface OverlayLoaderProps extends PropsWithChildren {
  isLoading?: boolean;
}

export default function OverlayLoader({
  children,
  isLoading = true,
}: OverlayLoaderProps) {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-1000 flex h-full min-w-full cursor-progress flex-col items-center justify-center gap-4 bg-black/25 text-center backdrop-blur-[2px]",
        isLoading ? "opacity-100" : "-z-100 opacity-0",
      )}
    >
      <Loader2 className="size-10 animate-spin text-primary" />
      <div>{children}</div>
    </div>
  );
}
