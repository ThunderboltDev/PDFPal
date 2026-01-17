import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import type { Organization, WebSite } from "schema-dts";
import Footer from "@/components/app/footer";
import Navbar from "@/components/app/navbar";
import Providers from "@/components/app/providers";
import CookieBanner from "@/components/cookie-consent/banner";
import { JsonLd } from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/sonner";
import { config } from "@/config";
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
        alt: `${config.name} Dashboard Preview`,
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
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: config.themeColor,
  colorScheme: "only light",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="scheme-light" lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.className)}
      >
        <Providers>
          <JsonLd<Organization>
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: config.name,
              url: config.url,
              logo: `${config.url}${config.logo.url}`,
              sameAs: [config.socials.github, config.socials.discord],
              contactPoint: {
                "@type": "ContactPoint",
                email: config.socials.email,
                contactType: "customer support",
              },
            }}
          />
          <JsonLd<WebSite>
            data={{
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: config.name,
              url: config.url,
              description: config.description,
            }}
          />
          <Toaster />
          <Navbar />
          {children}
          <Footer />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
