"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { format } from "date-fns";
import { BanknoteX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import ActionDialog from "./ui/action-dialog";

interface CancelSubscriptionButtonProps {
  currentPeriodEnd: Date;
}

export default function CancelSubscriptionButton({
  currentPeriodEnd,
}: CancelSubscriptionButtonProps) {
  const { mutateAsync: cancelSubscription } =
    trpc.subscription.cancelSubscription.useMutation({
      onSuccess: () => {
        sendGTMEvent({
          value: 1,
          event: "subscription_action",
          action: "cancel_subscription",
          button_name: "Cancel Subscription",
          page_path: window.location.pathname,
        });
        toast.success("Subscription canceled");
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    });

  return (
    <ActionDialog
      button={{
        className: "group",
        variant: "danger",
        children: (
          <>
            <BanknoteX className="group-hover:-rotate-15 transition-all duration-300 group-hover:scale-110" />
            Cancel Subscription
          </>
        ),
      }}
      dialog={{
        title: "Cancel Subscription?",
        description: (
          <>
            Are you sure you want to cancel your current subscription plan?
            After cancelling the subscription you will still be able to use{" "}
            <strong>Pro Plan</strong> features till{" "}
            {format(currentPeriodEnd, "dd/MM/yyyy")}
          </>
        ),
        buttonChildrenWhenLoading: (
          <>
            <Loader2 className="size-4 animate-spin" />
            Cancel Subscription
          </>
        ),
      }}
      onConfirm={async () => {
        await cancelSubscription();
      }}
    />
  );
}
