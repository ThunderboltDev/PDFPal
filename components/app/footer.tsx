"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaGithub, FaDiscord } from "react-icons/fa";
import config from "@/config";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const pathname = usePathname();

  const includedPaths = [
    "/",
    "/pricing",
    "/billing",
    "/contact",
    "/faq",
    "/cookie-policy",
    "/privacy-policy",
    "/terms-of-service",
  ];
  if (!includedPaths.includes(pathname)) return null;

  return (
    <footer className="bg-secondary shadow-2xl mt-16">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex flex-col gap-3 md:flex-row justify-evenly items-center">
          <h4 className="text-secondary-foreground text-center">
            {config.name}
          </h4>
          <ul className="p-0 list-none text-sm text-center grid grid-cols-2 gap-3 md:flex md:gap-10 md:flex-row">
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
                href="/privacy-policy"
                className="text-secondary-foreground"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                className="text-secondary-foreground"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-6 flex flex-col items-center justify-around gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <span>
            © {currentYear} {config.name}. All rights reserved.
          </span>
          <div className="flex gap-8">
            <Link
              href={config.socials.discord}
              target="_blank"
              aria-label="Discord"
            >
              <span className="sr-only">Discord</span>
              <FaDiscord className="size-8 text-[#5865F2] hover:scale-110 transition-transform ease-out duration-250" />
            </Link>
            <Link
              href={config.socials.github}
              target="_blank"
              aria-label="GitHub"
            >
              <span className="sr-only">GitHub</span>
              <FaGithub className="size-8 text-[#24292e] hover:scale-110 transition-transform ease-out duration-250" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
