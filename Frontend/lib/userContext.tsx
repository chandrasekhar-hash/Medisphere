"use client";
import { createContext, useContext, useState, useEffect } from "react";

export interface MedisphereUser {
  name: string;
  email: string;
  initials: string;
  phone?: string;
  location?: string;
  dob?: string;
  bloodGroup?: string;
  avatarUrl?: string;
}
interface UserContextType {
  user: MedisphereUser | null;
  setUser: (u: MedisphereUser) => void;
  logout: () => void;
}
const UserContext = createContext<UserContextType>({ user: null, setUser: () => {}, logout: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<MedisphereUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("mds_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const setUser = (u: MedisphereUser) => {
    try { localStorage.setItem("mds_user", JSON.stringify(u)); } catch {}
    setUserState(u);
  };

  const logout = () => {
    try { localStorage.removeItem("mds_user"); } catch {}
    setUserState(null);
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  if (!mounted) return <>{children}</>;
  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
