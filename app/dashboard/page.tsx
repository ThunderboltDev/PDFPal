import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Dashboard from "./dashboard";

export const metadata: Metadata = {
	title: "Dashboard",
};

export default async function DashboardWrapper() {
	const session = await auth();

	if (!session?.user?.email) {
		return redirect(`/auth?callbackUrl=${encodeURIComponent("/dashboard")}`);
	}

	return <Dashboard />;
}
