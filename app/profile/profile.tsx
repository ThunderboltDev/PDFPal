"use client";

import { LayoutDashboard, Link, LogOut, Plus, Trash, X } from "lucide-react";
import { FaUser } from "react-icons/fa";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { deleteAccount, linkAccount } from "@/firebase/user";
import { createNewDraftForm, getDraftFormsFromStorage } from "@/firebase/forms";
import type { LocalForm, User, UserData } from "@/firebase/types";
import OverlayLoader from "@/components/ui/overlay-loader";
import Skeleton from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import withAuth from "@/hoc/with-auth";

interface ProfileProps {
  userData: UserData;
  user: User;
}

function Profile({ userData, user }: ProfileProps) {
  const [loading, setLoading] = useState(false);
  const [draftForms, setDraftForms] = useState<LocalForm[]>([]);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setLoading(true);
    await deleteAccount(user);
    setLoading(false);
  };

  const handleLinkAccount = async () => {
    setLoading(true);
    await linkAccount(user, userData);
    setLoading(false);
  };

  useEffect(() => {
    if (!userData) setDraftForms(getDraftFormsFromStorage());
  }, [userData]);

  return (
    <div className="max-w-md mx-auto pt-20">
      <OverlayLoader loading={loading} />
      <h2>Profile</h2>
      <div className="space-y-1 bg-bg-200 shadow-md mt-4 p-4 rounded-lg">
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <div>
            {userData ? (
              userData.avatar ? (
                <Image
                  src={userData.avatar}
                  alt={`Avatar of ${userData.displayName || "User"}`}
                  width={64}
                  height={64}
                  className="mt-1 rounded-full"
                  loading="eager"
                />
              ) : (
                <div className="w-16 h-16 bg-bg-300 rounded-full flex items-center justify-center">
                  <FaUser className="w-8 h-8 text-fg-500" />
                </div>
              )
            ) : (
              <Skeleton
                width={64}
                height={64}
              />
            )}
          </div>
          <div className="flex flex-col gap-0 items-start mt-0">
            <span className="font-normal">
              {userData?.displayName ?? <Skeleton width={120} />}
            </span>
            {!userData?.isAnonymous && (
              <span className="text-fg-500 text-sm">
                {userData?.email ?? (
                  <Skeleton
                    width={80}
                    height={12}
                  />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
      <h3 className="mt-6">Forms</h3>
      <div className="space-y-1 bg-bg-200 shadow-md mt-4 p-4 rounded-lg">
        <p className="text-center text-sm text-fg-500">
          All your published forms show here!
        </p>
        {userData?.formsCreated ? (
          <></>
        ) : (
          <>
            <p className="text-center">
              You haven&apos;t published any forms yet!
            </p>
          </>
        )}
        <div className="grid place-items-center mt-4">
          <Button
            onClick={() => router.push("/dashboard")}
            className="mx-auto"
            variant="accent"
            size="small"
          >
            <LayoutDashboard />
            Go to Dashboard
          </Button>
        </div>
      </div>
      <div className="space-y-1 bg-bg-200 shadow-md mt-4 p-4 rounded-lg">
        <p className="text-center text-sm text-fg-500">
          All your drafted forms show here!
        </p>
        {draftForms.length ? (
          <></>
        ) : (
          <>
            <p className="text-center">
              You haven&apos;t created any forms yet! <br />
              Click the button below to get started.
            </p>
          </>
        )}
        <div className="grid place-items-center mt-4">
          <Button
            onClick={() => router.push(createNewDraftForm())}
            disabled={(userData?.formsCreated || 0) >= 5}
            variant="accent"
            size="small"
          >
            <Plus />
            Create New Form
          </Button>
        </div>
      </div>
      <h3 className="mt-6">Account Actions</h3>
      <div className="space-y-2 mt-4 w-64 mx-auto">
        {userData?.isAnonymous && (
          <ModalConfirmation
            icon={<Link />}
            variant="blue"
            label="Link Account"
            title="Link Account?"
            onConfirm={handleLinkAccount}
          >
            Linking your account allows you to connect it with another service
            or platform. This can enhance your experience and provide additional
            features.
          </ModalConfirmation>
        )}
        <ModalConfirmation
          icon={<LogOut />}
          variant="destructive"
          label="Logout"
          title="Confirm Logout?"
          onConfirm={() => router.push("/logout")}
        >
          Are you sure you want to log out? You will need to log in again to
          access your account.
        </ModalConfirmation>
        <ModalConfirmation
          icon={<Trash />}
          variant="destructive"
          label="Delete Account"
          title="Delete Account?"
          onConfirm={handleDeleteAccount}
        >
          Are you sure you want to delete your account? This action cannot be
          undone.
        </ModalConfirmation>
      </div>
      <div className="w-full my-6 text-sm text-center text-fg-500">
        {userData?.uid || ""}
      </div>
    </div>
  );
}

interface ModalConfirmationProps {
  icon: ReactNode;
  label: string;
  variant: "default" | "destructive" | "blue";
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}

function ModalConfirmation({
  icon,
  label,
  variant,
  onConfirm,
  title,
  children,
}: ModalConfirmationProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className="w-full"
        >
          {icon}
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{children}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2">
          <DialogClose asChild>
            <Button variant="light">
              <X />
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={variant}
              onClick={onConfirm}
            >
              {icon} {label}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default withAuth<ProfileProps>(Profile);
