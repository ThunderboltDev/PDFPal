import { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Link from "next/link";

const baseClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md " +
  "text-sm font-medium transition-all " +
  "shadow-md " +
  "no-underline " +
  "disabled:cursor-not-allowed disabled:saturate-0 " +
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 " +
  "shrink-0 [&_svg]:shrink-0 " +
  "outline-none focus-visible:border-ring " +
  "focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
  "aria-invalid:ring-danger/40 aria-invalid:border-danger ";

const buttonVariants = cva(baseClass, {
  variants: {
    variant: {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/20",
      accent:
        "bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent/20",
      info: "bg-info text-foreground hover:bg-info/90 focus-visible:ring-info/20",
      danger:
        "bg-danger text-foreground hover:bg-danger/90 focus-visible:ring-danger/20",
      success:
        "bg-success text-foreground hover:bg-success/90 focus-visible:ring-success/20",
      warning:
        "bg-warning text-foreground hover:bg-warning/90 focus-visible:ring-warning/20",
      outline:
        "border bg-background hover:bg-secondary text-accent-foreground focus-visible:ring-border/20",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/20",
      ghost:
        "bg-transparent hover:bg-secondary text-secondary-foreground shadow-none focus-visible:ring-secondary/20",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  asLink?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

interface ButtonLinkProps
  extends ComponentProps<typeof Link>,
    VariantProps<typeof buttonVariants> {
  href: string;
}

function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, ButtonLink, buttonVariants };
