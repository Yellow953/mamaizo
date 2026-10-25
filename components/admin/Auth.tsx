"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { clientAuth } from "@/lib/firebase/client";

type Auth =
  | { status: "loading" }
  | { status: "out" }
  | { status: "in"; user: User; isAdmin: boolean; getToken: () => Promise<string>; signOut: () => Promise<void> };

const AuthContext = createContext<Auth>({ status: "loading" });

export const useAuth = () => useContext(AuthContext);

// For pages inside the panel, which only render once an admin is signed in
export function useAdmin() {
  const auth = useAuth();
  if (auth.status !== "in") throw new Error("useAdmin outside the signed-in panel");
  return auth;
}

// Tracks the Firebase session for /admin. The admin claim only decides what to render;
// the server actions check it again on every write.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth>({ status: "loading" });

  useEffect(
    () =>
      onAuthStateChanged(clientAuth(), async (user) => {
        if (!user) return setAuth({ status: "out" });
        const isAdmin = (await user.getIdTokenResult()).claims.admin === true;
        setAuth({ status: "in", user, isAdmin, getToken: () => user.getIdToken(), signOut: () => signOut(clientAuth()) });
      }),
    [],
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
