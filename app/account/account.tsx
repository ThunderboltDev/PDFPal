import { PropsWithDbUser } from "@/hoc/with-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { SubscriptionPlan } from "@/lib/creem";

interface AccountProps {
  subscriptionPlan: SubscriptionPlan;
  filesUploaded: number;
  messages: number;
}

export default function Account({
  subscriptionPlan,
  filesUploaded,
  messages,
  dbUser,
}: PropsWithDbUser<AccountProps>) {
  const {
    name,
    isSubscribed,
    isCanceled,
    customerId,
    subscriptionId,
    currentPeriodEnd,
  } = subscriptionPlan;

  return (
    <div className="container-3xl mt-20">
      <h2 className="text-left">Account</h2>
      <p className="text-left">Manage your account information</p>
      <h6 className="text-left mt-6">Profile</h6>
      <Separator />
      <div className="flex items-center justify-start gap-4 mt-3">
        <Avatar className="size-16">
          <AvatarImage
            src={dbUser.avatarUrl ?? ""}
            alt="Your profile avatar"
          />
          <AvatarFallback className="text-2xl bg-secondary">
            <User className="size-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg text-left font-semibold">
            {dbUser.displayName ?? "Unnamed User"}
          </p>
          <p className="text-sm text-muted-foreground">{dbUser.email}</p>
        </div>
      </div>
      <h6 className="text-left mt-8">Current Plan</h6>
      <Separator />
      <div className="mt-3">
        <p className="text-left">
          You are currently on the{" "}
          <span className="font-semibold">{name} Plan</span>
        </p>
      </div>
    </div>
  );
}
