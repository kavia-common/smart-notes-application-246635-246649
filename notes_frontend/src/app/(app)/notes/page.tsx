"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/contexts/notes";

// PUBLIC_INTERFACE
export default function NotesHomePage() {
  /** Main area when no note is selected. */
  const router = useRouter();
  const { create } = useNotes();

  return (
    <div className="h-full grid place-items-center p-6">
      <div className="retro-card p-6 w-full max-w-2xl">
        <div className="text-sm muted">Tip</div>
        <h2 className="mt-1 text-2xl font-extrabold">Select a note</h2>
        <p className="mt-2 text-sm muted">
          Pick a note from the list, or create a new one. Changes autosave after a short pause.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="retro-btn retro-btn-primary"
            onClick={async () => {
              const id = await create();
              if (id) router.push(`/notes/${encodeURIComponent(id)}`);
            }}
          >
            + Create a note
          </button>

          <div className="retro-chip">
            Autosave: <span className="font-semibold">800ms debounce</span>
          </div>
          <div className="retro-chip">
            Preview: <span className="font-semibold">sanitized markdown</span>
          </div>
        </div>
      </div>
    </div>
  );
}
