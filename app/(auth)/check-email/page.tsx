import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import TryAgainButton from "./try-again-button";

export const metadata: Metadata = {
  title: "Verify your email",
  description:
    "Check your email to verify your PDF Pal account and continue using amazing AI PDF tools!",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckEmailPage(props: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  const searchParams = await props.searchParams;
  const email = searchParams.email;

  if (!email || typeof email !== "string") {
    redirect("/auth");
  }

  return (
    <div className="grid h-screen place-items-center bg-linear-110 from-primary/25 via-background to-accent/25 p-4">
      <div className="container-md flex flex-col rounded-lg bg-secondary p-6 text-center shadow-2xl">
        <h2>Check your email</h2>
        <p className="my-2 text-center text-sm">
          We sent a magic sign-in link to <strong>{email}</strong>.
        </p>
        <p className="text-center text-sm">
          Didn&apos;t receive it? Check your spam folder or try again.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <TryAgainButton email={email} />
        </div>
      </div>
    </div>
  );
}
