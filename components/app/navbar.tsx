"use client";

import {
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

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { Button, LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import config from "@/config";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Skeleton from "../ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

  const { data: session, status } = useSession();

  const excludedPaths = ["/auth", "/auth-callback", "/logout", "/thank-you"];
  if (excludedPaths.includes(pathname)) return null;

  const navLinks = [
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
  ];

  return (
    <nav className="fixed h-14 top-0 left-0 z-30 w-full border-b border-secondary bg-white/50 backdrop-blur-md transition-all">
      <div className="max-w-5xl px-4 flex h-14 items-center justify-between">
        <LinkButton
          href="/"
          variant="ghost"
          className="text-secondary-foreground hover:text-foreground text-lg font-semibold hover:bg-background/50"
        >
          {config.name}
        </LinkButton>
        <AnimatePresence>
          {isOpen && (
            <>
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
                <div className="flex gap-3 px-2 items-center text-lg">
                  <Image
                    src="/logo.webp"
                    height={35}
                    width={35}
                    alt={`${config.name} Logo`}
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
                            ? "text-accent/85 hover:text-accent hover:bg-accent/10"
                            : "text-secondary-foreground hover:text-foreground"
                        )}
                        onClick={() => setIsOpen(false)}
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
                    href={status === "authenticated" ? "/logout" : "/register"}
                    className={cn(
                      "w-full flex justify-start text-base md:text-[15px]",
                      {
                        "text-danger hover:bg-danger/10":
                          status === "authenticated",
                        "text-primary hover:bg-primary/10":
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
                  {status === "loading" ? (
                    <Skeleton
                      width="100%"
                      height={36}
                      borderRadius={6}
                    />
                  ) : (
                    status === "authenticated" && (
                      <LinkButton
                        href="/account"
                        variant="ghost"
                        className="w-full flex justify-start text-base md:text-[15px] px-3 text-primary hover:bg-primary/10"
                      >
                        <Avatar className="size-5">
                          <AvatarImage src={session.user.image ?? ""} />
                          <AvatarFallback className="size-5 bg-transparent">
                            <User className="size-5" />
                          </AvatarFallback>
                        </Avatar>
                        <span>{session.user?.name ?? "You"}</span>
                      </LinkButton>
                    )
                  )}
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
            </>
          )}
        </AnimatePresence>
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          size="icon"
          variant="ghost"
          className="text-secondary-foreground hover:text-foreground font-semibold hover:bg-background/50"
          aria-label="Open Sidebar"
        >
          <Menu className="size-6" />
          <span className="sr-only">Open Sidebar</span>
        </Button>
      </div>
    </nav>
  );
}
