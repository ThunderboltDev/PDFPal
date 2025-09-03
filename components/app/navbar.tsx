import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "@/lib/creem";
import NavbarWrapper from "./navbar-wrapper";

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <NavbarWrapper
      user={user}
      subscriptionPlan={subscriptionPlan}
    />
  );
}
