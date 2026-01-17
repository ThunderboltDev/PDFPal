import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ContactPage as ContactPageSchema } from "schema-dts";
import { JsonLd } from "@/components/seo/json-ld";
import { config } from "@/config";
import { auth } from "@/lib/auth";
import ContactPage from "./form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with PDF Pal. Reach out to us via email and social media or submit a form to give feedback or suggestions.",
  keywords: [
    "PDF Pal contact",
    "PDF Pal discord",
    "PDF Pal social media",
    "contact PDF Pal support",
    "email PDF Pal",
    "PDF Pal help",
    "PDF Pal support form",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default async function Contact() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <JsonLd<ContactPageSchema>
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Us",
          description: "Get in touch with PDF Pal support team.",
          url: `${config.url}/contact`,
        }}
      />
      <ContactPage session={session} />
    </>
  );
}
