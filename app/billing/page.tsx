import { getUserSubscriptionPlan } from "@/lib/creem";
import Billing from "./billing";

export default async function BillingPage() {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Billing subscriptionPlan={subscriptionPlan} />;
}
