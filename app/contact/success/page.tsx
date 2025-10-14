import { CircleQuestionMark, LayoutDashboard } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function SuccessPage() {
	return (
		<div className="flex h-view flex-col items-center justify-center">
			<h1 className="mb-4">Thank You!</h1>
			<p className="mx-4 mb-6 text-center text-lg text-secondary-foreground">
				We&apos;ve received your message. Our support team will get back to you
				shortly.
			</p>
			<div className="flex gap-4">
				<LinkButton href="/dashboard" variant="primary">
					<LayoutDashboard />
					Go to Dashboard
				</LinkButton>
				<LinkButton href="/faq" variant="accent">
					<CircleQuestionMark />
					Browse FAQ
				</LinkButton>
			</div>
		</div>
	);
}
