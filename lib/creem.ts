import axios from "axios";

import config, { CREEM_API_BASE } from "@/config";
import { getServerSession } from "next-auth";
import { db } from "./db";

const CREEM_API_KEY = process.env.CREEM_API_KEY!;
const plans = config.plans;

type Plans = typeof plans;
type Plan = Plans[keyof Plans];

export type SubscriptionPlan = Plan & {
  currentPeriodEnd?: Date;
  subscriptionId?: string;
  customerId?: string;
  isSubscribed: boolean;
  isCanceled: boolean;
};

export async function getUserSubscriptionPlan(): Promise<SubscriptionPlan> {
  const session = await getServerSession();

  if (!session || !session.user.id) {
    return {
      ...plans.free,
      isSubscribed: false,
      isCanceled: false,
    };
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!dbUser || !dbUser?.subscriptionId) {
    return {
      ...plans.free,
      isSubscribed: false,
      isCanceled: false,
    };
  }

  const response = await axios.get(`${CREEM_API_BASE}/subscriptions`, {
    headers: { "x-api-key": CREEM_API_KEY },
    params: { subscription_id: dbUser.subscriptionId },
    timeout: 10_000,
    proxy: false,
  });

  const subscription = response.data;

  const activeStates = ["active", "trialing", "canceled", "unpaid", "paused"];
  const isSubscribed = activeStates.includes(subscription.status);
  const isCanceled = subscription.status === "canceled";

  const plan =
    Object.values(plans).find(
      (plan) => plan.productId === subscription.product.id
    ) || plans.free;

  const currentPeriodEnd = new Date(subscription.current_period_end_date);

  return {
    ...plan,
    subscriptionId: dbUser.subscriptionId,
    customerId: subscription.customer.id,
    currentPeriodEnd,
    isSubscribed,
    isCanceled,
  };
}
