import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { PropsWithChildren } from "react";

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
        "fixed z-1000 top-0 left-0 h-full min-w-full bg-black/25 backdrop-blur-[2px] flex flex-col gap-4 justify-center items-center text-center cursor-progress",
        isLoading ? "opacity-100" : "opacity-0 -z-100"
      )}
    >
      <Loader2 className="size-10 animate-spin text-primary" />
      <div>{children}</div>
    </div>
  );
}
