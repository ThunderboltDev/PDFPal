import type { Metadata } from "next";
import type { SoftwareApplication } from "schema-dts";
import FAQ from "@/components/landing-page/faq";
import Features from "@/components/landing-page/features";
import Hero from "@/components/landing-page/hero";
import Steps from "@/components/landing-page/steps";
import { JsonLd } from "@/components/seo/json-ld";
import { config } from "@/config";

export const metadata: Metadata = {
  title: "AI PDF Assistant | PDF Pal",
  openGraph: {
    title: "AI PDF Assistant | PDF Pal",
    images: [
      {
        url: config.landing.url,
        width: config.landing.width,
        height: config.landing.height,
        alt: `${config.name} Landing Page`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI PDF Assistant | PDF Pal",
    images: [config.landing.url],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd<SoftwareApplication>
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: config.name,
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "120",
          },
        }}
      />
      <Hero />
      <Features />
      <Steps />
      <FAQ />
    </>
  );
}
