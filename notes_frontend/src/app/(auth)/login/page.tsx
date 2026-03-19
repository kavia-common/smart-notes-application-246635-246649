"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { getErrorMessage } from "@/lib/errors";

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** User login page. */
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      await login(email.trim(), password);
      router.push("/notes");
    } catch (err: unknown) {
      setStatus("error");
      setError(getErrorMessage(err, "Login failed"));
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
    }
  }

  return (
    <section className="retro-card p-6">
      <header>
        <div className="text-sm muted">Welcome back</div>
        <h1 className="mt-1 text-2xl font-extrabold">Login</h1>
        <p className="mt-2 text-sm muted">
          Sign in to access your notes.
        </p>
      </header>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            className="retro-input mt-2"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Password</label>
          <input
            className="retro-input mt-2"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error ? (
          <div className="retro-panel p-3 border-2 border-[#EF4444] bg-[color-mix(in_oklab,#ef4444_10%,var(--surface))]">
            <div className="text-sm font-semibold">Login failed</div>
            <div className="text-sm muted mt-1">{error}</div>
          </div>
        ) : null}

        <button
          className="retro-btn retro-btn-primary w-full"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <footer className="mt-6 text-sm muted">
        No account?{" "}
        <Link href="/register" className="underline">
          Create one
        </Link>
      </footer>
    </section>
  );
}
