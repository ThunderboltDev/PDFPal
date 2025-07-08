"use client";

import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { UserData } from "@/firebase/types";
import { useAuth } from "@/components/app/providers";

export default function withAuth<
  T extends { userData: UserData | null; user: User | null }
>(WrappedComponent: ComponentType<T>) {
  function AuthenticatedWrapper(props: Omit<T, "user" | "userData">) {
    const { user, userData, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) router.replace("/auth");
    }, [user, loading, router]);

    return (
      <WrappedComponent
        {...(props as T)}
        user={user}
        userData={userData}
      />
    );
  }

  AuthenticatedWrapper.displayName = `withAuth(${WrappedComponent.displayName} ?? Component)`;
  return AuthenticatedWrapper;
}
