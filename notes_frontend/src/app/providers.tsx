"use client";

import React from "react";
import { ThemeProvider } from "@/contexts/theme";
import { AuthProvider } from "@/contexts/auth";
import { NotesProvider } from "@/contexts/notes";

// PUBLIC_INTERFACE
export default function Providers({ children }: { children: React.ReactNode }) {
  /** App-level providers: theme, auth, and notes state. */
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>{children}</NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
