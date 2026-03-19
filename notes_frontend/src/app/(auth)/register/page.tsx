"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { getErrorMessage } from "@/lib/errors";

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** User registration page. */
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setStatus("error");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      await register(email.trim(), password);
      router.push("/notes");
    } catch (err: unknown) {
      setStatus("error");
      setError(getErrorMessage(err, "Registration failed"));
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
    }
  }

  return (
    <section className="retro-card p-6">
      <header>
        <div className="text-sm muted">New here?</div>
        <h1 className="mt-1 text-2xl font-extrabold">Create account</h1>
        <p className="mt-2 text-sm muted">
          Register to start saving notes to your account.
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Confirm password</label>
          <input
            className="retro-input mt-2"
            type="password"
            autoComplete="new-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Repeat password"
            required
          />
        </div>

        {error ? (
          <div className="retro-panel p-3 border-2 border-[#EF4444] bg-[color-mix(in_oklab,#ef4444_10%,var(--surface))]">
            <div className="text-sm font-semibold">Registration error</div>
            <div className="text-sm muted mt-1">{error}</div>
          </div>
        ) : null}

        <button
          className="retro-btn retro-btn-primary w-full"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Creating…" : "Create account"}
        </button>
      </form>

      <footer className="mt-6 text-sm muted">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </footer>
    </section>
  );
}
