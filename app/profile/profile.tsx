"use client";

import { format } from "date-fns";
import Image from "next/image";
import withAuth from "@/hoc/with-auth";
import type { UserData } from "@/firebase/types";
import Skeleton from "@/components/ui/skeleton";

interface ProfileProps {
  userData: UserData;
  user: null;
}

function Profile({ userData }: ProfileProps) {
  return (
    <div className="max-w-md mx-auto">
      <h2>Profile</h2>
      <div className="space-y-2">
        <div>
          {userData?.avatar ? (
            <Image
              src={userData.avatar}
              alt="User Avatar"
              width={64}
              height={64}
              className="rounded-full mt-1"
              loading="eager"
            />
          ) : (
            <Skeleton
              width={64}
              height={64}
              className="rounded-full"
            />
          )}
        </div>
        <ProfileRow
          label="UID"
          value={userData?.uid}
          skeletonWidth={200}
        />
        <ProfileRow
          label="Display Name"
          value={userData?.displayName}
          skeletonWidth={100}
        />
        <ProfileRow
          label="Email"
          value={userData?.email}
        />
        <ProfileRow
          label="Created At"
          value={
            userData?.createdAt
              ? format(userData?.createdAt.toDate(), "PPP")
              : null
          }
        />
      </div>
    </div>
  );
}

function ProfileRow({
  label,
  value,
  skeletonWidth,
}: {
  label: string;
  value: string | null | undefined;
  skeletonWidth?: number;
}) {
  return (
    <div>
      <span className="font-normal">{label}:</span>{" "}
      <span>{value ?? <Skeleton width={skeletonWidth || 120} />}</span>
    </div>
  );
}

export default withAuth<ProfileProps>(Profile);
