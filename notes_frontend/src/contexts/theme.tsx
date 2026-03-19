"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ThemeMode } from "@/lib/types";
import { readStorage, writeStorage } from "@/lib/storage";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "smart_notes_theme";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

function applyThemeClass(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const dark =
    mode === "dark" ? true : mode === "light" ? false : getSystemPrefersDark();
  document.documentElement.classList.toggle("dark", dark);
}

// PUBLIC_INTERFACE
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /** Provides app theme (light/dark/system) and persists it to localStorage. */
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const saved = readStorage(STORAGE_KEY) as ThemeMode | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      setMode(saved);
      applyThemeClass(saved);
      return;
    }
    applyThemeClass("system");
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEY, mode);
    applyThemeClass(mode);

    // React to OS theme changes when in system mode.
    if (mode !== "system") return;

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;

    const handler = () => applyThemeClass("system");
    media.addEventListener?.("change", handler);
    return () => media.removeEventListener?.("change", handler);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTheme(): ThemeContextValue {
  /** Access the ThemeContext. */
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
