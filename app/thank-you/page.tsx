"use client";

import {
  CheckCircle2,
  CircleQuestionMark,
  LayoutDashboard,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import withConfetti, {
  type WithConfettiProps,
} from "@/components/hoc/with-confetti";
import { LinkButton } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { config } from "@/config";

function ThankYouContent({ triggerConfetti }: WithConfettiProps) {
  const searchParams = useSearchParams();

  const productId = searchParams.get("product_id");

  const plan =
    productId === config.plans.pro.productId.monthly
      ? "PDF Pal Pro Plan (Monthly)"
      : "PDF Pal Pro Plan (Yearly)";

  useEffect(() => triggerConfetti(), [triggerConfetti]);

  return (
    <main className="flex items-center justify-center h-view container-lg">
      <div className="flex flex-col gap-3 justify-center items-center">
        <CheckCircle2 className="text-success" size={72} />
        <h2 className="text-center">
          Thank you for your purchase!{" "}
          <button type="button" onClick={() => triggerConfetti()}>
            🎉
          </button>
        </h2>
        <p className="text-center">
          You&apos;ve successfully subscribed to <strong>{plan}</strong>.
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Your account has been upgraded automatically — you can now enjoy all
          Pro features.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-6">
          <LinkButton variant="accent" href="/dashboard">
            <LayoutDashboard />
            Dashboard
          </LinkButton>
          <LinkButton variant="primary" href="/contact">
            <CircleQuestionMark />
            Need Help?
          </LinkButton>
        </div>
      </div>
    </main>
  );
}

function ThankYou(props: WithConfettiProps) {
  return (
    <Suspense fallback={<Loader />}>
      <ThankYouContent {...props} />
    </Suspense>
  );
}

export default withConfetti(ThankYou);
