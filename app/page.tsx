import type { Metadata } from "next";
import FAQ from "@/components/landing-page/faq";
import Features from "@/components/landing-page/features";
import Hero from "@/components/landing-page/hero";
import Steps from "@/components/landing-page/steps";

export const metadata: Metadata = {
  title: "AI PDF Assistant",
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
