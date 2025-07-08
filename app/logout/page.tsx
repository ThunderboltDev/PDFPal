"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doSignOut() {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Sign-out failed:", err);
      } finally {
        router.replace("/auth");
      }
    }

    doSignOut();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-center">
        <p className="mb-2 text-lg font-medium">Signing you out…</p>
      </div>
    </div>
  );
}
