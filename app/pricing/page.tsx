import { getServerSession } from "next-auth";

import { getUserSubscriptionPlan } from "@/lib/creem";
import Plans from "./plans";

export default async function Pricing() {
  const session = await getServerSession();
  const { isSubscribed } = await getUserSubscriptionPlan();

  return (
    <div className="mb-16 mt-24 px-2 sm:px-4 container-5xl">
      <h1>Pricing</h1>
      <p className="mt-5 text-muted-foreground sm:text-lg">
        Whether you&apos;re just trying out our service or need more, we&apos;ve
        got you covered!
      </p>
      <Plans
        isAuthenticated={!!session}
        isSubscribed={isSubscribed}
      />
    </div>
  );
}
