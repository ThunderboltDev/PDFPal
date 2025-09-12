"use client";

import { format } from "date-fns";
import { ArrowRight, Trash, User } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ActionDialog from "@/components/ui/action-dialog";
import { Separator } from "@/components/ui/separator";
import { PropsWithDbUser } from "@/hoc/with-auth";
import { SubscriptionPlan } from "@/lib/creem";
import config from "@/config";
import Link from "next/link";

const plans = config.plans;

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
    <div className="container-2xl mt-20">
      <h2>Account</h2>
      <p>Manage your account information</p>
      <h6 className="mt-6">Profile</h6>
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
          <p className="text-lg font-semibold">
            {dbUser.displayName ?? "Unnamed User"}
          </p>
          <p className="text-sm text-muted-foreground">{dbUser.email}</p>
        </div>
      </div>
      <h6 className="mt-8">Current Plan</h6>
      <Separator />
      <div className="mt-2">
        <div>
          <p>
            You are currently on the{" "}
            <span className="font-medium">{name} Plan</span>
          </p>
          {isSubscribed && currentPeriodEnd && (
            <p className="rounded-full text-xs text-muted-foreground">
              {isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on "}
              {format(currentPeriodEnd, "dd/MM/yyyy")}
            </p>
          )}
          {!isSubscribed && !isCanceled && (
            <p className="text-sm text-muted-foreground">
              Upgrade to <span className="font-medium">Pro Plan</span> for more
              features
            </p>
          )}
          {!!customerId && (
            <p>
              Customer ID: <span className="font-medium">{customerId}</span>
            </p>
          )}
          {!!subscriptionId && (
            <p>
              Subscription ID:{" "}
              <span className="font-medium">{subscriptionId}</span>
            </p>
          )}
          <p className="mt-2">
            <Link
              href="/billing"
              className="group"
            >
              Visit Billing Page{" "}
              <ArrowRight className="size-4.5 inline group-hover:translate-x-1.5 transition-transform ease-out" />
            </Link>
          </p>
        </div>
        <div></div>
      </div>
      <h6 className="mt-8">Usage</h6>
      <Separator />
      <div className="mt-2">
        <p>
          <span className="font-medium">Files Uploaded:</span> {filesUploaded} /{" "}
          {isSubscribed ? plans.pro.maxFiles : plans.free.maxFiles}
        </p>
        <p>
          <span className="font-medium">Total Messages:</span> {messages}
        </p>
      </div>
      <h6 className="mt-8">Danger Zone</h6>
      <Separator />
      <div className="mt-2 flex flex-row gap-6 items-center justify-between">
        <div>
          <p>Delete your account</p>
          <p className="text-sm text-muted-foreground">
            Delete your account, all uploaded files and chat messages
          </p>
        </div>
        <ActionDialog
          button={{
            children: (
              <>
                <Trash /> Delete
              </>
            ),
            variant: "danger",
          }}
          dialog={{
            title: "Delete Account",
            description: (
              <>
                <p>
                  Are you sure you want to delete your account? All of your user
                  data, PDF files and chat history will be deleted{" "}
                  <strong>permanently</strong>!
                </p>
              </>
            ),
          }}
          onConfirm={() => {}}
        />
      </div>
    </div>
  );
}
