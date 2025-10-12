import { Metadata } from "next";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import Pricing from "./pricing";

export const metadata: Metadata = {
  title: "Pricing",
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

  return (
    <Pricing
      isAuthenticated={!!session}
      isSubscribed={isSubscribed}
    />
  );
}
