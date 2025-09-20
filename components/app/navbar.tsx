"use client";

import {
  CircleQuestionMark,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { useHotkeys } from "react-hotkeys-hook";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button, LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import config from "@/config";

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
    href: "/contact",
    label: "Contact",
    icon: Mail,
  },
  {
    href: "faq",
    label: "FAQ",
    icon: CircleQuestionMark,
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const { status } = useSession();

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useHotkeys(["ctrl+b", "meta+b"], (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  });

  const excludedPaths = ["/auth", "/auth-callback", "/logout", "/thank-you"];
  if (excludedPaths.includes(pathname)) return null;

  return (
    <nav className="fixed h-14 top-0 left-0 z-30 w-full border-b border-secondary bg-white/50 backdrop-blur-md transition-all">
      <div className="max-w-5xl px-4 flex h-14 items-center justify-between">
        <LinkButton
          href="/"
          variant="ghost"
          className="text-secondary-foreground hover:text-foreground text-lg font-semibold hover:bg-transparent px-1"
        >
          <Image
            src="/logo.webp"
            alt={`${config.name} Logo`}
            className="size-9"
            height={100}
            width={100}
          />
          {config.name}
        </LinkButton>
        <ul className="hidden lg:flex gap-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <LinkButton
                href={link.href}
                variant="ghost"
                size="sm"
                className={cn(
                  pathname === link.href
                    ? "text-accent hover:bg-accent/5"
                    : "text-secondary-foreground hover:text-foreground"
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </LinkButton>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <LinkButton
            variant="ghost"
            size="sm"
            href={status === "authenticated" ? "/logout" : "/auth"}
            className={cn({
              "text-danger hover:bg-danger/5": status === "authenticated",
              "text-primary hover:bg-primary/5": status === "unauthenticated",
            })}
          >
            {status === "authenticated" ? (
              <>
                <LogOut className="size-4" />
                Log Out
              </>
            ) : (
              <>
                <UserPlus className="size-4" />
                Sign In
              </>
            )}
          </LinkButton>
        </div>

        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          size="icon"
          variant="ghost"
          className="md:hidden text-secondary-foreground hover:text-foreground font-semibold hover:bg-background/50"
          aria-label="Open Sidebar"
        >
          <Menu className="size-6" />
          <span className="sr-only">Open Sidebar</span>
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden">
            <motion.aside
              key="sidebar"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 min-h-screen w-56 bg-white shadow-lg z-100 p-3"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex gap-3 px-2 items-center text-lg font-semibold">
                <Image
                  src="/logo.webp"
                  height={100}
                  width={100}
                  alt={`${config.name} Logo`}
                  className="size-9"
                />
                <span>{config.name}</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="absolute top-0 right-0 size-8 text-secondary-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </Button>
              <ul className="space-y-2 mt-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <LinkButton
                      href={link.href}
                      size="default"
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-base md:text-[15px]",
                        pathname === link.href
                          ? "text-accent hover:bg-accent/5"
                          : "text-secondary-foreground hover:text-foreground"
                      )}
                    >
                      <link.icon className="size-5 md:size-4" />
                      {link.label}
                    </LinkButton>
                  </li>
                ))}
              </ul>
              <div className="w-full p-2 absolute left-0 bottom-0">
                <LinkButton
                  variant="ghost"
                  href={status === "authenticated" ? "/logout" : "/auth"}
                  className={cn(
                    "w-full flex justify-start text-base md:text-[15px]",
                    {
                      "text-danger hover:bg-danger/5":
                        status === "authenticated",
                      "text-primary hover:bg-primary/5":
                        status === "unauthenticated",
                    }
                  )}
                >
                  {status === "authenticated" ? (
                    <>
                      <LogOut className="size-5" />
                      Log Out
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-5" />
                      Sign In
                    </>
                  )}
                </LinkButton>
              </div>
            </motion.aside>
            <motion.div
              key="overlay"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-99 w-full min-h-screen bg-black/30 cursor-pointer"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
