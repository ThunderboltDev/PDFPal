import { SubscriptionEntity } from "creem/models/components";
import { Creem } from "creem";

export const creem = new Creem({
  serverIdx: process.env.CREEM_TEST_MODE! === "true" ? 1 : 0,
});

export function extractCustomerId(subscription: SubscriptionEntity) {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;
}
