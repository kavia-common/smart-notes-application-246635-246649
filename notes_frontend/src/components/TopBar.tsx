"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth";
import { cx } from "@/lib/utils";
import { MoonIcon, SunIcon } from "@/components/icons";

// PUBLIC_INTERFACE
export default function TopBar() {
  /** Top bar: branding, theme toggle, and user/logout. */
  const router = useRouter();
  const { toggle } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-[color-mix(in_oklab,var(--border)_30%,transparent)] bg-[var(--surface)]">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="retro-chip">
            <span className="font-extrabold">Smart Notes</span>
            <span className="muted">retro</span>
          </div>
          <div className="hidden sm:block text-sm muted truncate">
            Markdown • Tags • Autosave • Pin/Favorite
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cx("retro-btn", "inline-flex items-center gap-2")}
            onClick={toggle}
            title="Toggle light/dark"
          >
            <SunIcon />
            <MoonIcon />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="retro-chip">
              {user?.email ?? "anonymous"}
            </span>
            <button
              type="button"
              className="retro-btn"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>

          <button
            type="button"
            className="retro-btn md:hidden"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
