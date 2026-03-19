import React from "react";

// PUBLIC_INTERFACE
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  /** Layout for auth screens. */
  return (
    <main className="min-h-screen retro-bg grid place-items-center px-6 py-10">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
