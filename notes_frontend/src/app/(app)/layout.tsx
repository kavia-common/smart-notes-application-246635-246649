import React from "react";
import AppShell from "@/components/AppShell";

// PUBLIC_INTERFACE
export default function AppLayout({ children }: { children: React.ReactNode }) {
  /** Layout for authenticated app screens. */
  return <AppShell>{children}</AppShell>;
}
