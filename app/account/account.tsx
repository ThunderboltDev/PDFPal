"use client";

import { Loader2, LogOut, Trash, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";
import { Session } from "next-auth";
import { format } from "date-fns";
import { toast } from "sonner";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UpgradeButton } from "@/components/upgrade-button";
import ActionDialog from "@/components/ui/action-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/app/_trpc/client";
import config from "@/config";

const plans = config.plans;

interface AccountProps {
  session: Session | null;
}

export default function Account({ session: currentSession }: AccountProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: sessions } = trpc.user.getUserSessions.useQuery();
  const { data: totalUsage } = trpc.user.getTotalUsage.useQuery();
  const { data: userWithAccounts } = trpc.user.getUserWithAccounts.useQuery();

  const { data: subscriptionPlan } =
    trpc.subscription.getUserSubscriptionPlan.useQuery();

  const { mutateAsync: deleteAccount } = trpc.user.deleteAccount.useMutation({
    onSuccess: () => {
      router.replace("/auth?callbackUrl=/account");
    },
    onError: () => {
      toast.error("Something went wrong while deleting your account!");
    },
  });

  const { mutateAsync: deleteSession } =
    trpc.user.deleteUserSession.useMutation({
      onSuccess: () => {
        utils.user.getUserSessions.invalidate();
        toast.success("Device removed!");
      },
      onError: () => {
        toast.error("Failed to remove device!");
      },
    });

  return (
    <div className="container-2xl mt-20">
      <h2>Account</h2>
      <p>Manage your account information</p>
      <h6 className="mt-6">Profile</h6>
      <Separator />
      <div className="flex items-center justify-start gap-4 mt-3">
        <Avatar className="size-16 shadow-sm">
          {userWithAccounts && (
            <AvatarImage
              src={userWithAccounts.image ?? ""}
              alt="Your profile avatar"
            />
          )}
          <AvatarFallback className="text-2xl bg-secondary">
            <User className="size-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          {userWithAccounts ? (
            <p className="text-lg font-semibold">
              {userWithAccounts.name ?? "You"}
            </p>
          ) : (
            <Skeleton width={160} />
          )}
          <p className="text-sm text-muted-foreground">
            {userWithAccounts ? (
              <>{userWithAccounts.email}</>
            ) : (
              <Skeleton width={80} />
            )}
          </p>
        </div>
      </div>
      <h6 className="mt-8">Subscription</h6>
      <Separator />
      <div className="mt-2 flex flex-row gap-6 items-center justify-between">
        <div>
          {subscriptionPlan ? (
            <p>
              You are currently on the{" "}
              <span className="font-medium">{subscriptionPlan.name} Plan</span>
            </p>
          ) : (
            <Skeleton width={256} />
          )}
          <p className="text-sm text-muted-foreground">
            {subscriptionPlan ? (
              subscriptionPlan?.isSubscribed &&
              subscriptionPlan?.currentPeriodEnd ? (
                <>
                  {subscriptionPlan.isCanceled
                    ? "Your plan will be canceled on "
                    : "Your plan renews on "}
                  {format(subscriptionPlan.currentPeriodEnd, "dd/MM/yyyy")}
                </>
              ) : (
                <>
                  Upgrade to <span className="font-medium">Pro Plan</span> for
                  more features
                </>
              )
            ) : (
              <Skeleton width={200} />
            )}
          </p>
        </div>
        <div>
          {subscriptionPlan ? (
            <UpgradeButton isSubscribed={subscriptionPlan.isSubscribed} />
          ) : (
            <Skeleton
              borderRadius={6}
              width={150}
              height={36}
            />
          )}
        </div>
      </div>
      <h6 className="mt-8">Total Usage</h6>
      <Separator />
      <div className="mt-2">
        <p>
          <span className="font-medium">Files Uploaded:</span>{" "}
          {totalUsage ? (
            <span>
              {totalUsage.files} /{" "}
              {subscriptionPlan?.isSubscribed
                ? plans.pro.maxFiles
                : plans.free.maxFiles}
            </span>
          ) : (
            <Skeleton
              className="inline"
              width={50}
            />
          )}
        </p>
        <p>
          <span className="font-medium">Total Messages:</span>{" "}
          {totalUsage?.messages ?? (
            <Skeleton
              className="inline"
              width={35}
            />
          )}
        </p>
      </div>
      <h6 className="mt-8">Active Devices</h6>
      <Separator />
      <div className="mt-2 space-y-3">
        {sessions && sessions.length > 0 ? (
          sessions.map((session, index) => {
            const parser = new UAParser(session.userAgent ?? "");
            const deviceName = `${parser.getOS().name ?? "Unknown OS"} ${
              parser.getOS().version ?? "- Unknown Version"
            }`;
            const isCurrent =
              session.sessionToken === currentSession?.sessionToken;
            return (
              <div
                key={index}
                className="flex flex-row justify-between items-center"
              >
                <div className="text-muted-foreground text-sm">
                  <p className="text-secondary-foreground text-base font-semibold flex flex-row gap-2 items-center">
                    {deviceName}
                    {isCurrent && <Badge variant="primary">You</Badge>}
                  </p>
                  <p>
                    {session.country && session.city ? (
                      <>
                        {session.city}, {session.country}
                      </>
                    ) : session.country ? (
                      <>{session.country}</>
                    ) : session.city ? (
                      <>{session.city}</>
                    ) : (
                      <></>
                    )}
                  </p>
                  <p>
                    {parser.getBrowser().name ?? "Unknown Browser"}{" "}
                    {parser.getBrowser().version ?? "- Unknown Version"}
                  </p>
                  <p>
                    {format(
                      new Date(session.lastActivity),
                      "dd/MM/yyyy hh:mm a"
                    )}
                  </p>
                </div>
                <div>
                  {!isCurrent && (
                    <ActionDialog
                      dialog={{
                        title: "Remove Device",
                        description: (
                          <>
                            Are you sure you want to remove{" "}
                            <strong>{deviceName}</strong>? This will log the
                            device out.
                          </>
                        ),
                        button: {
                          variant: "danger",
                          children: (
                            <>
                              <LogOut className="size-4" />
                              Remove Device
                            </>
                          ),
                        },
                        buttonChildrenWhenLoading: (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Removing...
                          </>
                        ),
                      }}
                      button={{
                        children: (
                          <>
                            <LogOut className="size-4" /> Remove
                          </>
                        ),
                        variant: "danger",
                        size: "sm",
                      }}
                      onConfirm={async () => {
                        await deleteSession({
                          sessionToken: session.sessionToken,
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            <Skeleton
              className="h-18 w-full"
              borderRadius={12}
              inline={true}
              count={2}
            />
          </div>
        )}
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
          dialog={{
            title: "Delete Account",
            description: (
              <>
                Are you sure you want to delete your account? All of your user
                data, PDF files and chat history will be{" "}
                <strong>permanently</strong> deleted!
              </>
            ),
            button: {
              variant: "danger",
              children: (
                <>
                  <Trash className="size-4" />
                  Delete Account
                </>
              ),
            },
            buttonChildrenWhenLoading: (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ),
          }}
          button={{
            variant: "danger",
            children: (
              <>
                <Trash /> Delete
              </>
            ),
          }}
          onConfirm={async () => {
            await deleteAccount();
          }}
        />
      </div>
    </div>
  );
}
