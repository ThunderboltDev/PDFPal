import type { Metadata } from "next";
import FAQ from "@/components/landing-page/faq";
import Features from "@/components/landing-page/features";
import Hero from "@/components/landing-page/hero";
import Steps from "@/components/landing-page/steps";
import config from "@/config";

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
};

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Steps />
      <FAQ />
    </>
  );
}
