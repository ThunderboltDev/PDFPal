"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trpc } from "../_trpc/client";

export default function UpgradeButton() {
  const { mutate: createCheckoutSession } =
    trpc.createCheckoutSession.useMutation({
      onSuccess: ({ checkoutUrl }) => (window.location.href = checkoutUrl),
    });
  return (
    <Button
      variant="primary"
      onClick={() => createCheckoutSession({})}
      className="w-full"
    >
      Upgrade Now <ArrowRight className="size-5 ml-1.5" />
    </Button>
  );
}
