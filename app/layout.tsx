import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";

import Footer from "@/components/app/footer";
import Navbar from "@/components/app/navbar";
import Providers from "@/components/app/providers";
import { Toaster } from "@/components/ui/sonner";
import config from "@/config";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: {
    template: `%s | ${config.name}`,
    default: config.name,
  },
  description: config.description,
  keywords: [...config.keywords],
  applicationName: config.name,
  creator: config.creator,
  category: "technology",
  icons: {
    icon: config.logo.url,
    apple: config.logo.url,
    shortcut: config.logo.url,
  },
  openGraph: {
    title: {
      template: `%s | ${config.name}`,
      default: config.name,
    },
    url: config.url,
    siteName: config.name,
    description: config.description,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: config.preview.url,
        width: config.preview.width,
        height: config.preview.height,
        alt: `${config.name} Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: `%s | ${config.name}`,
      default: config.name,
    },
    description: config.description,
    creator: "",
    images: [config.preview.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: config.themeColor,
  colorScheme: "only light",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      className="scheme-light"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <meta
          name="google-site-verification"
          content="c7IzeYfMHu6s2EryNuQs5O8PrvHGzAkIhz1pT9jG_Dc"
        />
        <GoogleTagManager gtmId={config.gtmId} />
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.className)}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
