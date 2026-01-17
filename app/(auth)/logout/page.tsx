import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Logout",
  description: "Log out of your PDF Pal account safely and securely.",
  keywords: [
    "PDF Pal logout",
    "PDF Pal log out",
    "PDF Pal signout",
    "PDF Pal sign out",
  ],
};

interface LogoutProps {
  params: Promise<{ callbackUrl?: string }>;
}

export default async function LogoutWrapper({ params }: LogoutProps) {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect(`/auth?callbackUrl=${(await params).callbackUrl ?? "/dashboard"}`);

  return null;
}
