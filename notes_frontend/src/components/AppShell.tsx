"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import TagSidebar from "@/components/TagSidebar";
import NoteList from "@/components/NoteList";
import { useAuth } from "@/contexts/auth";

// PUBLIC_INTERFACE
export default function AppShell({ children }: { children: React.ReactNode }) {
  /** App shell for authenticated routes: top bar + tags + notes list + main content. */
  const router = useRouter();
  const { token, isLoading } = useAuth();

  // Client-side guard (token is stored in localStorage via AuthProvider).
  useEffect(() => {
    if (isLoading) return;
    if (!token) router.replace("/login");
  }, [token, isLoading, router]);

  return (
    <div className="min-h-screen retro-bg">
      <TopBar />

      <div className="h-[calc(100vh-60px)] md:h-[calc(100vh-64px)] flex overflow-hidden">
        {/* Tags */}
        <aside className="hidden lg:block w-72 border-r border-[color-mix(in_oklab,var(--border)_25%,transparent)] bg-[var(--surface)]">
          <TagSidebar />
        </aside>

        {/* Notes */}
        <section className="hidden sm:block w-[360px] border-r border-[color-mix(in_oklab,var(--border)_25%,transparent)] bg-[var(--surface)]">
          <NoteList />
        </section>

        {/* Main */}
        <main className="flex-1 overflow-hidden bg-[var(--surface)]">
          <div className="h-full">{children}</div>
        </main>
      </div>

      {/* Mobile stacked layout */}
      <div className="sm:hidden border-t border-[color-mix(in_oklab,var(--border)_25%,transparent)] bg-[var(--surface)]">
        <div className="grid grid-cols-1">
          <div className="border-b border-[color-mix(in_oklab,var(--border)_25%,transparent)]">
            <TagSidebar />
          </div>
          <div className="h-[45vh]">
            <NoteList />
          </div>
          <div className="h-[55vh] border-t border-[color-mix(in_oklab,var(--border)_25%,transparent)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
