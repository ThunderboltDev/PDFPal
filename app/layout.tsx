import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

import Navbar from "@/components/app/navbar";
import Providers from "@/components/app/providers";
import { Toaster } from "@/components/ui/sonner";

import config from "@/config";
import { cn } from "@/lib/utils";

import "react-loading-skeleton/dist/skeleton.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.name,
  description: config.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scheme-light"
      suppressHydrationWarning
    >
      <Providers>
        <body
          className={cn("font-sans min-h-screen antialiased", inter.className)}
        >
          <SkeletonTheme duration={2}>
            <Navbar />
            {children}
          </SkeletonTheme>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
