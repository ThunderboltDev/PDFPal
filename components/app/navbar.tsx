import Link from "next/link";
import config from "@/config";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky h-14 top-0 left-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <div className="container-7xl">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href="/"
            className="text-foreground hover:text-foreground no-underline flex z-40 text-lg font-semibold"
          >
            {config.name}
          </Link>
          <div className="hidden items-center space-x-4 sm:flex">
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-gray-700 no-underline"
              )}
            >
              Pricing
            </Link>
            <LoginLink
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-gray-700 no-underline"
              )}
            >
              Login
            </LoginLink>
            <RegisterLink
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "no-underline"
              )}
            >
              Get Started <ArrowRight className="size-4" />
            </RegisterLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
