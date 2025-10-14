import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";
import { auth } from "@/lib/auth";
import CheckEmail from "./check-email";

export const metadata: Metadata = {
  title: "Verify your email",
  description:
    "Check your email to verify your PDF Pal account and continue using amazing AI PDF tools!",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckEmailWrapper() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<Loader />}>
      <CheckEmail />
    </Suspense>
  );
}
