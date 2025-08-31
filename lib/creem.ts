import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";

import config, { CREEM_API_BASE } from "@/config";
import { db } from "./db";

const plans = config.plans;
const CREEM_API_KEY = process.env.CREEM_API_KEY!;

export interface SubscriptionPlan {
  readonly name: "pro" | "free";
  readonly price: number;
  readonly currency: "USD";
  readonly interval?: "month" | "year";
  readonly productId: string;

  currentPeriodEnd?: Date;
  subscriptionId?: string;
  customerId?: string;
  isSubscribed: boolean;
  isCanceled: boolean;
}

export async function getUserSubscriptionPlan(): Promise<SubscriptionPlan> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return {
      ...plans[0],
      isSubscribed: false,
      isCanceled: false,
    };
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser || !dbUser?.subscriptionId) {
    return {
      ...plans[0],
      isSubscribed: false,
      isCanceled: false,
    };
  }

  const response = await axios.get(
    `${CREEM_API_BASE}/subscriptions/${dbUser.subscriptionId}`,
    {
      headers: { "x-api-key": CREEM_API_KEY },
    }
  );

  const subscription = response.data;
  console.log("subscription:", subscription);

  const activeStates = ["active", "trialing", "canceled", "unpaid", "paused"];
  const isSubscribed = activeStates.includes(subscription.status);
  const isCanceled = subscription.status === "canceled";

  const plan =
    plans.find((plan) => plan.productId === subscription.product.id) ||
    plans[0];

  const currentPeriodEnd = new Date(
    subscription.current_period_end_date * 1000
  );

  return {
    ...plan,
    subscriptionId: dbUser.subscriptionId,
    customerId: subscription.customer.id,
    currentPeriodEnd,
    isSubscribed,
    isCanceled,
  };
}
