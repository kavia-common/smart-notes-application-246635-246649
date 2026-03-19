"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";

// PUBLIC_INTERFACE
export default function Home() {
  /** Landing route: redirect to /notes when authenticated, otherwise /login. */
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    router.replace(token ? "/notes" : "/login");
  }, [isLoading, token, router]);

  return (
    <main className="min-h-screen retro-bg grid place-items-center px-6">
      <div className="retro-card p-6 w-full max-w-md">
        <div className="text-sm muted">Booting Smart Notes…</div>
        <div className="mt-2 font-semibold">Loading</div>
        <div className="mt-4 h-2 rounded bg-[color-mix(in_oklab,var(--accent)_20%,transparent)]" />
      </div>
    </main>
  );
}
