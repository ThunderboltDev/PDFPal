import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import Loader from "@/components/ui/loader";
import { auth } from "@/lib/auth";
import Logout from "./logout";

export const metadata: Metadata = {
	title: "Logout",
	description: "Log out of your account!",
};

export default async function LogoutWrapper() {
	const session = await auth();

	if (!session) {
		redirect("/auth");
	}

	return (
		<Suspense fallback={<Loader />}>
			<Logout />
		</Suspense>
	);
}
