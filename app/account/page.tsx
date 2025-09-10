import withAuth from "@/hoc/with-auth";
import { getUserSubscriptionPlan } from "@/lib/creem";

import Account from "./account";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AccountWrapper() {
  const subscriptionPlan = await getUserSubscriptionPlan();
  const session = await getServerSession();

  if (!session) return;

  const user = await db.user.findUnique({
    where: {
      email: session.user.email ?? "",
    },
    select: {
      _count: {
        select: {
          File: true,
          Message: true,
        },
      },
    },
  });

  const ProtectedDashboard = withAuth(Account, { origin: "/account" });

  return (
    <ProtectedDashboard
      subscriptionPlan={subscriptionPlan}
      filesUploaded={user?._count.File ?? 0}
      messages={user?._count.Message ?? 0}
    />
  );
}
