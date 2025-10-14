import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import ContactPage from "./form";

export const metadata: Metadata = {
	title: "Contact",
};

export default async function Contact() {
	const session = await auth();

	return <ContactPage session={session} />;
}
