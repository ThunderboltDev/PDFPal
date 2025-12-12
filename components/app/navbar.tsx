"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CircleQuestionMark,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { Button, LinkButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import config from "@/config";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    href: "/account",
    label: "Account",
    icon: User,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: DollarSign,
  },
  {
    href: "/billing",
    label: "Billing",
    icon: CreditCard,
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: CircleQuestionMark,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Mail,
  },
];

const sidebarVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

type SessionStatus = "authenticated" | "unauthenticated" | "loading";

function AuthActionButton({
  status,
  className = "",
  size = "sm",
}: {
  status: SessionStatus;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
}) {
  if (status === "loading") {
    return (
      <>
        <Skeleton
          className="!hidden md:!inline-flex -translate-y-2"
          height={32}
          width={95}
        />
        <Skeleton className="md:!hidden" height={36} width={208} />
      </>
    );
  }

  const isAuthenticated = status === "authenticated";

  return (
    <LinkButton
      className={cn(
        {
          "text-danger hover:bg-danger/5": isAuthenticated,
        },
        className
      )}
      href={
        isAuthenticated
          ? "/logout"
          : "/auth?utm_source=navbar&utm_medium=button&utm_campaign=signup"
      }
      size={size}
      variant={isAuthenticated ? "ghost" : "primary"}
      onClick={() => {
        if (isAuthenticated) {
          sendGTMEvent({
            value: 1,
            event: "auth",
            action: "logout",
          });
        } else {
          sendGTMEvent({
            value: 1,
            event: "cta_click",
            place: "navbar",
            button_name: "Get Started",
          });
        }
      }}
    >
      {isAuthenticated ? (
        <>
          <LogOut className="size-4" />
          Log Out
        </>
      ) : (
        <>
          Get started
          <ArrowRight />
        </>
      )}
    </LinkButton>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const { status } = useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the navbar when navigating
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname]);

  useHotkeys(["ctrl+b", "meta+b"], (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  });

  const excludedPaths = ["/auth", "/check-email", "/logout", "/thank-you"];

  if (excludedPaths.includes(pathname)) return null;

  return (
    <nav className="fixed top-0 left-0 z-98 h-14 w-full border-gray-300 border-b bg-muted/50 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <LinkButton
          className="px-1 font-semibold text-lg text-secondary-foreground hover:bg-transparent hover:text-foreground"
          href="/"
          variant="ghost"
        >
          <Image
            alt={`${config.name} Logo`}
            className="size-9"
            height={100}
            src="/logo.webp"
            width={100}
          />
          {config.name}
        </LinkButton>

        <ul className="ml-0 hidden list-none gap-4 py-2 md:flex lg:hidden">
          {navLinks.slice(0, 4).map((link) => (
            <li key={link.href}>
              <LinkButton
                className={cn(
                  pathname === link.href
                    ? "text-accent hover:bg-accent/5"
                    : "text-secondary-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                href={link.href}
                size="sm"
                variant="ghost"
              >
                <link.icon className="size-4" />
                {link.label}
              </LinkButton>
            </li>
          ))}
        </ul>

        <ul className="ml-0 hidden list-none gap-4 py-2 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <LinkButton
                className={cn(
                  pathname === link.href
                    ? "text-accent hover:bg-accent/5"
                    : "text-secondary-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                href={link.href}
                size="sm"
                variant="ghost"
              >
                <link.icon className="size-4" />
                {link.label}
              </LinkButton>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <AuthActionButton status={status} />
        </div>

        <Button
          aria-label="Open Sidebar"
          className="font-semibold text-secondary-foreground hover:bg-muted/50 hover:text-foreground md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          size="icon"
          variant="ghost"
        >
          <Menu className="size-6" />
          <span className="sr-only">Open Sidebar</span>
        </Button>
      </div>
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="md:hidden">
                <motion.div
                  animate="visible"
                  aria-hidden
                  className="fixed inset-0 z-99 min-h-screen w-full cursor-pointer bg-black/25 backdrop-blur-[2px]"
                  exit="hidden"
                  initial="hidden"
                  key="overlay"
                  onClick={() => setIsOpen(false)}
                  transition={{ duration: 0.2 }}
                  variants={overlayVariants}
                />
                <motion.aside
                  animate="visible"
                  aria-modal="true"
                  className="fixed inset-0 z-100 min-h-screen w-56 bg-secondary p-3 shadow-lg"
                  exit="hidden"
                  initial="hidden"
                  key="sidebar"
                  role="dialog"
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  variants={sidebarVariants}
                >
                  <Button
                    className="absolute top-0 right-0 size-8 text-secondary-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="size-5" />
                  </Button>
                  <div className="flex items-center gap-3 px-2 font-semibold text-lg">
                    <Image
                      alt={`${config.name} Logo`}
                      className="size-9"
                      height={100}
                      src="/logo.webp"
                      width={100}
                    />
                    <span>{config.name}</span>
                  </div>
                  <ul className="mt-4 ml-0 list-none space-y-2">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <LinkButton
                          className={cn(
                            "w-full justify-start text-base md:text-[15px]",
                            pathname === link.href
                              ? "text-accent hover:bg-accent/5"
                              : "text-secondary-foreground hover:text-foreground"
                          )}
                          href={link.href}
                          size="default"
                          variant="ghost"
                        >
                          <link.icon className="size-5 md:size-4" />
                          {link.label}
                        </LinkButton>
                      </li>
                    ))}
                  </ul>
                  <div className="absolute bottom-0 left-0 w-full p-2">
                    <AuthActionButton
                      className="flex w-full justify-start text-base md:text-[15px]"
                      size="default"
                      status={status}
                    />
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </nav>
  );
}
