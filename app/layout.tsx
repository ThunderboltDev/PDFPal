import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import { getServerSession } from "next-auth";
import { SkeletonTheme } from "react-loading-skeleton";

import Footer from "@/components/app/footer";
import Navbar from "@/components/app/navbar";
import Providers from "@/components/app/providers";
import { Toaster } from "@/components/ui/sonner";

import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import config from "@/config";

import "react-loading-skeleton/dist/skeleton.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.name,
  description: config.description,
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className="scheme-light"
      suppressHydrationWarning
    >
      <body className={cn("font-sans min-h-view antialiased", inter.className)}>
        <Providers session={session}>
          <SkeletonTheme duration={2}>
            {children}
            <Navbar />
            <Footer />
          </SkeletonTheme>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
