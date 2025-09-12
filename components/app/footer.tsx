"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import config from "@/config";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const pathname = usePathname();

  const includedPaths = ["/", "/pricing", "/billing", "/account"];
  if (!includedPaths.includes(pathname)) return null;

  return (
    <footer className="bg-background mt-16">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex flex-col gap-3 md:flex-row justify-evenly">
          <div>
            <h4 className="text-secondary-foreground text-center">
              {config.name}
            </h4>
          </div>
          <ul className="mt-3 text-sm text-center grid grid-cols-2 gap-3 md:flex md:gap-10 md:flex-row">
            <li>
              <Link
                href="/billing"
                className="text-secondary-foreground"
              >
                Billing
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="text-secondary-foreground"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-secondary-foreground"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-secondary-foreground"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-secondary-foreground"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-6 flex flex-col items-center justify-around gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <span>
            © {currentYear} {config.name}. All rights reserved.
          </span>
          <div className="flex space-x-4">
            <Link
              href="https://twitter.com"
              target="_blank"
              aria-label="X (formerly Twitter)"
            >
              <span className="sr-only">X (formerly Twitter)</span>
              Twitter
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              aria-label="GitHub"
            >
              <span className="sr-only">GitHub</span>
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
