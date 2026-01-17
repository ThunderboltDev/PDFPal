import type { Metadata } from "next";
import type { FAQPage as FAQPageSchema } from "schema-dts";
import { JsonLd } from "@/components/seo/json-ld";
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
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  return (
    <>
      <JsonLd<FAQPageSchema>
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is PDF Pal about?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "PDF Pal is a platform that allows users to upload and chat with PDFs using AI technology.",
              },
            },
            {
              "@type": "Question",
              name: "How does PDF Pal work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Users can upload their PDF documents, and our AI will analyze the content to provide answers to their questions.",
              },
            },
            {
              "@type": "Question",
              name: "Is PDF Pal free to use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, PDF Pal is completely free to use. However, we also offer a Pro Plan with additional features.",
              },
            },
          ],
        }}
      />
      <FAQ />
    </>
  );
}
