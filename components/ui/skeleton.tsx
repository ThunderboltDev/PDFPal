import SkeletonBase, { SkeletonProps } from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import { cn } from "@/lib/utils";

interface CustomSkeletonProps extends SkeletonProps {
  borderRadius?: string | number;
  variant?: keyof typeof skeletonVariants;
}

const skeletonVariants = {
  default: {
    baseColor: "var(--color-neutral-300)",
    highlightColor: "var(--color-neutral-200)",
    className: "",
  },
  secondary: {
    baseColor: "var(--color-background)",
    highlightColor: "var(--color-secondary)",
    className: "",
  },
  muted: {
    baseColor: "var(--color-background)",
    highlightColor: "var(--color-muted)",
    className: "[&_*]:opacity-50",
  },
};

function Skeleton({
  variant = "default",
  className,
  ...props
}: CustomSkeletonProps) {
  const variantConfig = skeletonVariants[variant];

  return (
    <SkeletonBase
      {...props}
      duration={2}
      baseColor={variantConfig.baseColor}
      highlightColor={variantConfig.highlightColor}
      borderRadius={props.borderRadius ?? 8}
      containerClassName={cn(
        "!contents !h-0 !flex-1 !cursor-progress",
        variantConfig.className,
        className
      )}
    />
  );
}

export { Skeleton };
