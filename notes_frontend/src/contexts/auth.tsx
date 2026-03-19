"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/lib/types";
import { apiLogin, apiRegister } from "@/lib/api";
import { readJsonStorage, removeStorage, writeJsonStorage } from "@/lib/storage";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "smart_notes_auth";

type StoredAuth = {
  token: string;
  user: User;
};

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /** Provides authentication state and actions. */
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readJsonStorage<StoredAuth>(STORAGE_KEY);
    if (stored?.token) {
      setToken(stored.token);
      setUser(stored.user ?? null);
    }
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      login: async (email, password) => {
        const res = await apiLogin(email, password);
        setToken(res.token);
        setUser(res.user);
        writeJsonStorage(STORAGE_KEY, res);
      },
      register: async (email, password) => {
        const res = await apiRegister(email, password);
        setToken(res.token);
        setUser(res.user);
        writeJsonStorage(STORAGE_KEY, res);
      },
      logout: () => {
        setToken(null);
        setUser(null);
        removeStorage(STORAGE_KEY);
      },
    }),
    [token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextValue {
  /** Access the AuthContext. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
