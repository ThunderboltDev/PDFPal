import withAuth from "@/hoc/with-auth";
import Dashboard from "./dashboard";
import { getUserSubscriptionPlan } from "@/lib/creem";

export const dynamic = "force-dynamic";

export default async function DashboardWrapper() {
  const { isSubscribed } = await getUserSubscriptionPlan();
  const ProtectedDashboard = withAuth(Dashboard, `/dashboard`);

  return <ProtectedDashboard isSubscribed={isSubscribed} />;
}
