import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const baseClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md " +
  "text-sm font-medium transition-all " +
  "shadow-sm " +
  "no-underline " +
  "disabled:cursor-not-allowed disabled:opacity-75 disabled:saturate-0 " +
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 " +
  "shrink-0 [&_svg]:shrink-0 " +
  "outline-none focus-visible:border-primary " +
  "focus-visible:ring-primary/50 focus-visible:ring-[3px] " +
  "aria-invalid:ring-danger/40 aria-invalid:border-danger ";

const buttonVariants = cva(baseClass, {
  variants: {
    variant: {
      default:
        "bg-secondary text-foreground hover:bg-secondary/80 hover:text-secondary-foreground focus-visible:ring-primary/50",
      muted:
        "bg-muted text-foreground hover:bg-muted/80 hover:text-secondary-foreground focus-visible:ring-primary/50",
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/50",
      accent:
        "bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent/50",
      info: "bg-info text-white hover:bg-info/90 focus-visible:ring-info/50",
      danger:
        "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/50",
      success:
        "bg-success text-white hover:bg-success/90 focus-visible:ring-success/50",
      warning:
        "bg-warning text-white hover:bg-warning/90 focus-visible:ring-warning/50",
      ghost:
        "bg-transparent text-foreground shadow-none hover:bg-muted focus-visible:ring-primary/50",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
      responsive:
        "h-9 px-4 py-2 has-[>svg]:px-3 md:h-8 md:gap-1.5 md:rounded-md md:px-3 md:has-[>svg]:px-2.5",
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
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

interface ButtonLinkProps
  extends ComponentProps<typeof Link>,
    VariantProps<typeof buttonVariants> {
  href: string;
}

function LinkButton({ className, variant, size, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, LinkButton, buttonVariants };
