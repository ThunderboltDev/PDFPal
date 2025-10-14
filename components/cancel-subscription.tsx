"use client";

import { format } from "date-fns";
import { BanknoteX, Loader2 } from "lucide-react";

import ActionDialog from "./ui/action-dialog";

interface CancelSubscriptionButtonProps {
	currentPeriodEnd: Date;
}

export default function CancelSubscriptionButton({
	currentPeriodEnd,
}: CancelSubscriptionButtonProps) {
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
			onConfirm={() => {}}
		/>
	);
}
