"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaDiscord, FaGithub } from "react-icons/fa";
import CookiePreferences from "@/components/cookie-consent/preferences";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    <footer className="mt-16 bg-secondary border-t border-border shadow-xl">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 gap-8 xs:grid-cols-3">
          <div className="xs:col-span-3">
            <div>
              <h3 className="mb-2">{config.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {config.description}
              </p>
            </div>
            <div className="mt-6 flex gap-6">
              <Link
                aria-label="Discord"
                href={config.socials.discord}
                target="_blank"
                className="text-muted-foreground hover:text-[#5865F2] transition-colors"
              >
                <FaDiscord className="size-8" />
              </Link>
              <Link
                aria-label="GitHub"
                href={config.socials.github}
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaGithub className="size-8" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  href="/pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  href="/billing"
                >
                  Billing
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  href="/faq"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  href="/privacy-policy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  href="/terms-of-service"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  href="/cookie-policy"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <CookiePreferences>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:underline underline-offset-2 p-0 h-auto font-normal"
                  >
                    Cookie Preferences
                  </Button>
                </CookiePreferences>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {currentYear} {config.name}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Made with ❤️ for better document analysis
          </p>
        </div>
      </div>
    </footer>
  );
}
