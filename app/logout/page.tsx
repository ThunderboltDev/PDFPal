"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    const logout = async () =>
      await signOut({
        callbackUrl: "/login",
      });
    logout();
  });

  return (
    <div className="w-full h-view grid place-items-center">
      <p className="text-secondary-foreground animate-pulse">
        Logging you out...
      </p>
    </div>
  );
}
