"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { UserData } from "@/firebase/types";
import { auth, db } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  userData: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const query = doc(db, "users", user.uid);
        const unsubscribeSnap = onSnapshot(
          query,
          (snap) => {
            setUserData(snap.exists() ? (snap.data() as UserData) : null);
            setLoading(false);
          },
          () => unsubscribeSnap()
        );

        return unsubscribeSnap;
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, user, loading }}>
      <NextThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        enableColorScheme
        disableTransitionOnChange
      >
        {children}
      </NextThemeProvider>
    </AuthContext.Provider>
  );
}
