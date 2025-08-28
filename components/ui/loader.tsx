import { Loader2 } from "lucide-react";
import { PropsWithChildren } from "react";

export default function Loader({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[calc(100vh-8rem)] min-w-full flex flex-col gap-4 justify-center items-center text-center">
      <Loader2 className="size-10 animate-spin text-primary" />
      <div>{children}</div>
    </div>
  );
}
