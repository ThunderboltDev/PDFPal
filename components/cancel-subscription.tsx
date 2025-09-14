"use client";

import { format } from "date-fns";
import ActionDialog from "./ui/action-dialog";
import { BanknoteX } from "lucide-react";

interface CancelSubscriptionButtonProps {
  currentPeriodEnd: Date;
}

export default function CancelSubscriptionButton({
  currentPeriodEnd,
}: CancelSubscriptionButtonProps) {
  return (
    <ActionDialog
      dialog={{
        title: "Cancel Subscription?",
        description: (
          <>
            Are you sure you want to cancel your current subscription plan?
            After cancelling the subscription you will still be able to use Pro
            Plan features till {format(currentPeriodEnd, "dd/MM/yyyy")}
          </>
        ),
      }}
      button={{
        variant: "danger",
        children: (
          <>
            <BanknoteX />
            Cancel Subscription
          </>
        ),
      }}
      onConfirm={() => {}}
    />
  );
}
