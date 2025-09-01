"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileNavProps {
  isAuthenticated: boolean;
}

export default function MobileNav({ isAuthenticated }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleNavbar = () => setIsOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleNavbar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeOnSamePage = (href: string) => {
    if (pathname === href) toggleNavbar();
  };

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleNavbar}
        className="size-5 relative z-50 text-zinc-800"
      />
      {isOpen && (
        <div className="fixed animate-in slide-in-from-bottom-5 fade-in-20 inset-0 z-1 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnSamePage("/sign-up")}
                    className="flex items-center w-full font-semibold"
                    href="/sign-up"
                  >
                    Get Started <ArrowRight className="mr-2 size-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnSamePage("/sign-in")}
                    className="flex items-center w-full font-semibold"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnSamePage("pricing")}
                    className="flex items-center w-full font-semibold"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnSamePage("/dashboard")}
                    className="flex items-center w-full font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnSamePage("sign-out")}
                    className="flex items-center w-full font-semibold"
                    href="/sign-out"
                  >
                    Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
