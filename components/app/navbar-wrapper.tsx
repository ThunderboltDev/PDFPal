"use client";

import Link from "next/link";
import config from "@/config";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./user-account-nav";
import MobileNav from "./mobile-nav";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { usePathname } from "next/navigation";
import { SubscriptionPlan } from "@/lib/creem";

interface NavbarWrapperProps {
  user: KindeUser<Record<string, string>> | null;
  subscriptionPlan: SubscriptionPlan;
}

export default function NavbarWrapper({
  user,
  subscriptionPlan,
}: NavbarWrapperProps) {
  const pathname = usePathname();

  const excludedPaths = ["/login"];
  if (excludedPaths.includes(pathname)) return null;

  return (
    <nav className="fixed h-14 top-0 left-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <div className="container-7xl">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href="/"
            className="text-foreground hover:text-foreground no-underline flex z-40 text-lg font-semibold"
          >
            {config.name}
          </Link>
          <MobileNav isAuthenticated={!!user} />
          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-gray-700 no-underline"
                  )}
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  name={
                    user.username ??
                    user.given_name ??
                    user.family_name ??
                    "Your Account"
                  }
                  email={user.email}
                  avatarUrl={user.picture}
                  subscriptionPlan={subscriptionPlan}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
