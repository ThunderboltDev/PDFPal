"use client";

import { FaUserCircle } from "react-icons/fa";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  starWars,
} from "unique-names-generator";
import {
  User,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/components/app/providers";
import { Button } from "@/components/ui/button";
import OverlayLoader from "@/components/ui/overlay-loader";
import { UserData } from "@/firebase/types";
import { db, auth } from "@/lib/firebase";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const { user, loading: loadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && user) router.push("/profile");
  }, [loadingAuth, user, router]);

  const createUserProfile = async (user: User) => {
    const uid = user.uid;
    const isAnon = user.isAnonymous;
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
    }

    const displayName =
      isAnon || !user.displayName
        ? uniqueNamesGenerator({
            dictionaries: [adjectives, starWars],
            separator: " ",
            style: "capital",
          })
        : user.displayName;

    const avatar = isAnon ? null : user.photoURL;
    const email = user.email ?? null;

    const userData: UserData = {
      uid,
      displayName,
      avatar,
      email,
      isAnonymous: isAnon,
      createdAt: serverTimestamp() as Timestamp,
      lastLogin: serverTimestamp() as Timestamp,
    };

    await setDoc(userRef, userData);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      router.replace("/profile");
    } catch (error) {
      console.error("Google Sign In Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      await createUserProfile(result.user);
      router.replace("/profile");
    } catch (error) {
      console.error("Anonymous Sign In Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OverlayLoader loading={loading || loadingAuth} />
      <div className="w-screen h-screen grid items-center">
        <div className="bg-bg-300 rounded-md p-5 w-3/4 max-w-96 mx-auto">
          <h2>Welcome!</h2>
          <p className="text-sm text-fg-300 text-center mt-2">
            Create an account or login to continue!
          </p>
          <div className="flex flex-col gap-2 mt-1">
            <Button
              variant="light"
              onClick={handleGoogleSignIn}
            >
              <Image
                src="/misc/google-logo.webp"
                alt="Google Logo"
                width={18}
                height={18}
              />
              Continue with Google
            </Button>
            <Button
              variant="light"
              onClick={handleAnonymousSignIn}
            >
              <FaUserCircle className="size-5" />
              Continue as a Guest
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
