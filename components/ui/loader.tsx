import { Loader2 } from "lucide-react";
import type { PropsWithChildren } from "react";

export default function Loader({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen min-w-full flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="size-10 animate-spin text-primary" />
      <div>{children}</div>
    </div>
  );
}
