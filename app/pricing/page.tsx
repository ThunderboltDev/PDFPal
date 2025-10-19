import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import Pricing from "./pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Explore PDF Pal's pricing plans: Free and Pro. Choose the plan that fits your PDF AI needs.",
  keywords: [
    "PDF Pal pricing",
    "PDF Pal plans",
    "PDF Pal subscription",
    "PDF Pal free plan",
    "PDF Pal Pro plan",
  ],
};

export default async function PricingWrapper() {
  const session = await auth();

  const user = await db.user.findUnique({
    where: {
      id: session?.userId,
    },
    select: {
      currentPeriodEnd: true,
    },
  });

  const isSubscribed =
    !!user?.currentPeriodEnd && user.currentPeriodEnd > new Date();

  return <Pricing isAuthenticated={!!session} isSubscribed={isSubscribed} />;
}
