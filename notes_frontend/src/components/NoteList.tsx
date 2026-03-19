"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNotes } from "@/contexts/notes";
import type { Note } from "@/lib/types";
import { cx } from "@/lib/utils";
import { PinIcon, StarIcon, TrashIcon } from "@/components/icons";

function noteMatches(note: Note, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  return (
    (note.title ?? "").toLowerCase().includes(query) ||
    (note.content ?? "").toLowerCase().includes(query) ||
    (note.tags ?? []).some((t) => t.toLowerCase().includes(query))
  );
}

// PUBLIC_INTERFACE
export default function NoteList() {
  /** Notes list panel with filtering and actions. */
  const router = useRouter();
  const pathname = usePathname();
  const {
    notes,
    query,
    setQuery,
    activeTag,
    onlyPinned,
    onlyFavorites,
    isLoading,
    error,
    create,
    remove,
    update,
  } = useNotes();

  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return notes
      .filter((n) => (activeTag ? (n.tags ?? []).includes(activeTag) : true))
      .filter((n) => (onlyPinned ? !!n.pinned : true))
      .filter((n) => (onlyFavorites ? !!n.favorite : true))
      .filter((n) => noteMatches(n, query))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, activeTag, onlyPinned, onlyFavorites, query]);

  async function handleCreate() {
    const id = await create();
    if (id) router.push(`/notes/${encodeURIComponent(id)}`);
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const ok = await remove(id);
    setBusyId(null);
    if (ok && pathname?.includes(`/notes/${id}`)) {
      router.push("/notes");
    }
  }

  const activeNoteId = useMemo(() => {
    const match = pathname?.match(/\/notes\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }, [pathname]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[color-mix(in_oklab,var(--border)_25%,transparent)] bg-[var(--surface)]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-sm muted">Notes</div>
            <div className="font-extrabold text-lg">{filtered.length}</div>
          </div>
          <button
            type="button"
            className="retro-btn retro-btn-primary"
            onClick={handleCreate}
          >
            + New
          </button>
        </div>

        <div className="mt-3">
          <input
            className="retro-input"
            placeholder="Search title, content, tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search notes"
          />
        </div>

        {error ? (
          <div className="mt-3 text-sm">
            <span className="retro-chip bg-[color-mix(in_oklab,#ef4444_12%,var(--surface))]">
              {error}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2 bg-[var(--surface)]">
        {isLoading ? (
          <div className="retro-panel p-4 muted text-sm">Loading…</div>
        ) : null}

        {!filtered.length && !isLoading ? (
          <div className="retro-panel p-4">
            <div className="font-semibold">No notes found</div>
            <div className="mt-1 text-sm muted">
              Try clearing filters or create a new note.
            </div>
          </div>
        ) : null}

        {filtered.map((n) => {
          const isActive = activeNoteId === String(n.id);
          return (
            <div
              key={String(n.id)}
              className={cx(
                "retro-panel p-3",
                isActive &&
                  "bg-[color-mix(in_oklab,var(--accent)_14%,var(--surface))] border-[var(--border)]",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/notes/${encodeURIComponent(String(n.id))}`}
                    className="block"
                  >
                    <div className="font-extrabold truncate">
                      {n.title?.trim() ? n.title : "Untitled"}
                    </div>
                    <div className="mt-1 text-xs muted truncate">
                      {(n.content ?? "").replaceAll("\n", " ").slice(0, 90) || "No content"}
                    </div>
                  </Link>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {(n.tags ?? []).slice(0, 4).map((t) => (
                      <span key={t} className="retro-chip">
                        #{t}
                      </span>
                    ))}
                    {(n.tags ?? []).length > 4 ? (
                      <span className="retro-chip">+{(n.tags ?? []).length - 4}</span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    className={cx("retro-btn !px-2 !py-2", n.pinned && "retro-btn-primary")}
                    aria-label="Toggle pinned"
                    aria-pressed={n.pinned}
                    onClick={() => void update(String(n.id), { pinned: !n.pinned })}
                    title="Pin"
                  >
                    <PinIcon className="opacity-90" />
                  </button>
                  <button
                    type="button"
                    className={cx(
                      "retro-btn !px-2 !py-2",
                      n.favorite && "retro-btn-primary",
                    )}
                    aria-label="Toggle favorite"
                    aria-pressed={n.favorite}
                    onClick={() => void update(String(n.id), { favorite: !n.favorite })}
                    title="Favorite"
                  >
                    <StarIcon className="opacity-90" />
                  </button>
                  <button
                    type="button"
                    className="retro-btn !px-2 !py-2"
                    aria-label="Delete note"
                    disabled={busyId === String(n.id)}
                    onClick={() => void handleDelete(String(n.id))}
                    title="Delete"
                  >
                    <TrashIcon className="opacity-90" />
                  </button>
                </div>
              </div>

              <div className="mt-2 text-[11px] muted">
                Updated: {new Date(n.updatedAt).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
