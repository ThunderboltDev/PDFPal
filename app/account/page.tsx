import { getUserSubscriptionPlan } from "@/lib/creem";
import { db } from "@/lib/db";

import Account from "./account";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function AccountWrapper() {
  const subscriptionPlan = await getUserSubscriptionPlan();
  const session = await getServerSession();

  if (!session || !session.user || !session.user.email)
    return redirect("/auth");

  const usage = await db.user.findUnique({
    where: {
      email: session.user.email,
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

  const userWithAccounts = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      displayName: true,
      email: true,
      avatarUrl: true,
      accounts: {
        select: {
          provider: true,
          createdAt: true,
        },
      },
    },
  });

  return (
    <Account
      subscriptionPlan={subscriptionPlan}
      userWithAccounts={userWithAccounts}
      filesUploaded={usage?._count.File ?? 0}
      messages={usage?._count.Message ?? 0}
    />
  );
}
