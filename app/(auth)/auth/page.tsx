import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";
import { auth } from "@/lib/auth";
import Auth from "./auth";

type AuthWrapperProps = {
  params: Promise<{ callbackUrl?: string }>;
};

export const metadata: Metadata = {
  title: "Create an Account or Login",
  description:
    "Create an account or login on PDF Pal to start interacting with your PDFs with the help of AI. Secure and fast access to all your PDF tools.",
  keywords: [
    "PDF Pal login",
    "PDF Pal signin",
    "PDF Pal signup",
    "PDF Pal authentication",
    "PDF Pal access",
    "PDF Pal create account",
  ],
};

export default async function AuthWrapper({ params }: AuthWrapperProps) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session) {
    redirect((await params).callbackUrl ?? "/dashboard");
  }

  return (
    <Suspense fallback={<Loader />}>
      <Auth />
    </Suspense>
  );
}
