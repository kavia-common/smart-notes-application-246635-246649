import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen retro-bg grid place-items-center px-6">
      <section
        className="retro-card p-6 w-full max-w-lg"
        role="alert"
        aria-live="assertive"
      >
        <h1 className="text-2xl font-extrabold">404 — Page Not Found</h1>
        <p className="mt-2 muted">
          The page you’re looking for doesn’t exist (or got lost in the
          terminal).
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link className="retro-btn retro-btn-primary" href="/notes">
            Go to Notes
          </Link>
          <Link className="retro-btn" href="/login">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
