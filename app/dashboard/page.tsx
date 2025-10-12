import { Metadata } from "next";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardWrapper() {
  const session = await auth();

  if (!session || !session.user || !session.user.email)
    return redirect(`/auth?callbackUrl=${encodeURIComponent("/dashboard")}`);

  return <Dashboard />;
}
