import type { Metadata } from "next";
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
};

export default async function Contact() {
  const session = await auth();

  return <ContactPage session={session} />;
}
