"use client";

import { Mail, Trash, User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ActionDialog from "@/components/ui/action-dialog";
import { Separator } from "@/components/ui/separator";
import Skeleton from "@/components/ui/skeleton";
import { SubscriptionPlan } from "@/lib/creem";
import config from "@/config";
import { UpgradeButton } from "@/components/upgrade-button";

const providers = {
  google: {
    name: "Google",
    image: "/providers/google.webp",
  },
  github: {
    name: "GitHub",
    image: "/providers/github.webp",
  },
  email: {
    name: "Email",
    icon: <Mail />,
  },
} as const;

const plans = config.plans;

interface AccountProps {
  userWithAccounts: {
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
    accounts: {
      createdAt: Date;
      provider: string;
    }[];
  } | null;
  subscriptionPlan: SubscriptionPlan;
  filesUploaded: number;
  messages: number;
}

export default function Account({
  userWithAccounts,
  subscriptionPlan,
  filesUploaded,
  messages,
}: AccountProps) {
  const { name, isSubscribed, isCanceled, currentPeriodEnd } = subscriptionPlan;

  return (
    <div className="container-2xl mt-20">
      <h2>Account</h2>
      <p>Manage your account information</p>
      <h6 className="mt-6">Profile</h6>
      <Separator />
      <div className="flex items-center justify-start gap-4 mt-3">
        <Avatar className="size-16">
          {userWithAccounts?.avatarUrl ? (
            <AvatarImage
              src={userWithAccounts.avatarUrl ?? ""}
              alt="Your profile avatar"
            />
          ) : (
            <Skeleton className="size-16" />
          )}
          <AvatarFallback className="text-2xl bg-secondary">
            <User className="size-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          {userWithAccounts ? (
            <p className="text-lg font-semibold">
              {userWithAccounts.displayName}
            </p>
          ) : (
            <Skeleton />
          )}
          {userWithAccounts ? (
            <p className="text-sm text-muted-foreground">
              {userWithAccounts.email}
            </p>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
      <h6 className="mt-8">Accounts</h6>
      <Separator />
      <div className="mt-2 space-y-1">
        {userWithAccounts?.accounts.map((account) => {
          const provider = account.provider as keyof typeof providers;
          const providerName = providers[provider].name;
          return (
            <div
              key={account.provider}
              className="flex flex-row gap-2 items-center"
            >
              {provider === "email" ? (
                providers[provider].icon
              ) : (
                <Image
                  src={providers[provider].image}
                  alt={`Provider: ${providerName}`}
                  className="size-5"
                  width={128}
                  height={128}
                  loading="lazy"
                />
              )}
              <span className="font-medium">{providerName}</span>
              <span className="text-muted-foreground">
                {format(new Date(account.createdAt), "dd/MM/yyyy")}
              </span>
            </div>
          );
        })}
      </div>
      <h6 className="mt-8">Subscription</h6>
      <Separator />
      <div className="mt-2 flex flex-row gap-6 items-center justify-between">
        <div>
          <p>
            You are currently on the{" "}
            <span className="font-medium">{name} Plan</span>
          </p>
          {isSubscribed && currentPeriodEnd && (
            <p className="text-xs text-muted-foreground">
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
        </div>
        <div>
          <UpgradeButton isSubscribed={isSubscribed} />
        </div>
      </div>
      <h6 className="mt-8">Total Usage</h6>
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
      <div className="mt-2 mb-12 flex flex-row gap-6 items-center justify-between">
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
                Are you sure you want to delete your account? All of your user
                data, PDF files and chat history will be deleted{" "}
                <strong>permanently</strong>!
              </>
            ),
          }}
          onConfirm={() => {}}
        />
      </div>
    </div>
  );
}
