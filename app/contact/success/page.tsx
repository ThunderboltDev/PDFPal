import { BadgeCheck, CircleQuestionMark, LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Submitted",
  description:
    "Thank you for reaching out! Your message has been successfully recorded. We will get back to you shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessPage() {
  return (
    <div className="flex h-view flex-col items-center justify-center">
      <BadgeCheck className="size-20 text-success fill-green-100" />
      <h1 className="mb-4 mt-6">Thank You!</h1>
      <p className="mx-4 mb-6 text-center text-lg text-secondary-foreground">
        We&apos;ve received your message. Our support team will get back to you
        shortly.
      </p>
      <div className="flex gap-4">
        <LinkButton
          href="/dashboard"
          variant="primary"
        >
          <LayoutDashboard />
          Go to Dashboard
        </LinkButton>
        <LinkButton
          href="/faq"
          variant="accent"
        >
          <CircleQuestionMark />
          Browse FAQ
        </LinkButton>
      </div>
    </div>
  );
}
