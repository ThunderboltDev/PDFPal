import type { Metadata } from "next";
import Billing from "./billing";

export const metadata: Metadata = {
  title: "Billing",
  description:
    "Manage your PDF Pal subscription, view transactions, upgrade to Pro plan, check billing status and periods.",
  keywords: [
    "PDF Pal billing",
    "PDF Pal manage subscription",
    "PDF Pal upgrade plan",
    "PDF Pal subscription status",
    "PDF Pal billing period",
    "PDF Pal cancel subscription",
    "PDF Pal transaction history",
  ],
};

export default async function BillingPage() {
  return <Billing />;
}
