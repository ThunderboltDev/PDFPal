import type { Metadata } from "next";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";
import AuthCallback from "./auth-callback";

export const metadata: Metadata = {
	title: "Auth Callback",
	description: "Redirecting you to your destination!",
};

export default function AuthCallbackPage() {
	return (
		<Suspense fallback={<Loader />}>
			<AuthCallback />
		</Suspense>
	);
}
