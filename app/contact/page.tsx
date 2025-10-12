import { auth } from "@/lib/auth";
import ContactPage from "./form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function Contact() {
  const session = await auth();

  return <ContactPage session={session} />;
}
