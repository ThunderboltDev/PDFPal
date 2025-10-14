import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";
import { auth } from "@/lib/auth";
import Auth from "./auth";

type AuthWrapperProps = {
	params: Promise<{ callbackUrl?: string }>;
};

export const metadata: Metadata = {
	title: "Create an account or Login",
	description:
		"Create an account or login to start chatting with your PDF rightaway!",
};

export default async function AuthWrapper({ params }: AuthWrapperProps) {
	const session = await auth();
	const { callbackUrl } = await params;

	if (session) {
		redirect(callbackUrl ?? "/dashboard");
	}

	return (
		<Suspense fallback={<Loader />}>
			<Auth />
		</Suspense>
	);
}
