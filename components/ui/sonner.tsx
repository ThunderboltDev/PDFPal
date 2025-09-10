"use client";

import {
  Info,
  Loader2,
  BadgeCheck,
  CircleAlert,
  AlertTriangle,
} from "lucide-react";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      theme="light"
      gap={12}
      closeButton={true}
      icons={{
        info: <Info className="text-info size-5" />,
        error: <CircleAlert className="text-danger size-5" />,
        success: <BadgeCheck className="text-success size-5" />,
        warning: <AlertTriangle className="text-warning size-5" />,
        loading: (
          <Loader2 className="text-secondary-foreground animate-spin size-5" />
        ),
      }}
      toastOptions={{
        classNames: {
          title: "text-[15px] font-normal text-secondary-foreground",
          toast: "!py-2 !px-4 gap-3 items-center",
          closeButton: "text-danger",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
