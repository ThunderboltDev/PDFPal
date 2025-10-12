import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import Account from "./account";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountWrapper() {
  const session = await auth();

  if (!session || !session.user || !session.user.email)
    return redirect(`/auth?callbackUrl=${encodeURIComponent("/account")}`);

  return <Account session={session} />;
}
