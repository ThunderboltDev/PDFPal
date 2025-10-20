import type { Metadata } from "next";
import FAQ from "./faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find answers to frequently asked questions about PDF Pal, including features, subscriptions, and using AI with PDFs.",
  keywords: [
    "PDF Pal FAQ",
    "PDF Pal help",
    "PDF Pal support",
    "PDF AI questions",
    "PDF tools guide",
  ],
};

export default function FAQPage() {
  return <FAQ />;
}
