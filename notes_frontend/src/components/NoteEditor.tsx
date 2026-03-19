"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";
import TagChipsEditor from "@/components/TagChipsEditor";
import { useNotes } from "@/contexts/notes";
import type { Note } from "@/lib/types";
import { cx } from "@/lib/utils";
import { PinIcon, StarIcon } from "@/components/icons";
import { getErrorMessage } from "@/lib/errors";

type Props = { noteId: string };

// PUBLIC_INTERFACE
export default function NoteEditor({ noteId }: Props) {
  /** Note editor with markdown preview and debounced autosave. */
  const { getById, ensureLoaded, update, demoMode } = useNotes();

  const note = getById(noteId);

  const [local, setLocal] = useState<Note | null>(note ?? null);
  const [activePane, setActivePane] = useState<"edit" | "preview">("edit");

  const [saveState, setSaveState] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const lastSavedRef = useRef<string>("");

  // Load note if not present in context.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await ensureLoaded(noteId);
      if (cancelled) return;
      setLocal(loaded ?? null);
      setSaveState("idle");
      setSaveError(null);
      lastSavedRef.current = loaded ? JSON.stringify(loaded) : "";
    })();
    return () => {
      cancelled = true;
    };
  }, [noteId, ensureLoaded]);

  // Keep local in sync if context updates (e.g., toggles from list).
  useEffect(() => {
    if (!note) return;
    setLocal(note);
  }, [note]);

  const isReady = !!local;

  const dirtyFingerprint = useMemo(() => {
    if (!local) return "";
    return JSON.stringify({
      title: local.title,
      content: local.content,
      tags: local.tags,
      pinned: local.pinned,
      favorite: local.favorite,
    });
  }, [local]);

  // Debounced autosave.
  useEffect(() => {
    if (!isReady) return;

    const wasSaved = lastSavedRef.current === dirtyFingerprint;
    if (wasSaved) {
      setSaveState("idle");
      return;
    }

    setSaveState("dirty");
    setSaveError(null);

    const timer = window.setTimeout(async () => {
      if (!local) return;
      setSaveState("saving");
      try {
        const saved = await update(noteId, {
          title: local.title,
          content: local.content,
          tags: local.tags,
          pinned: local.pinned,
          favorite: local.favorite,
        });
        if (!saved) throw new Error("Save failed");
        lastSavedRef.current = JSON.stringify(saved);
        setSaveState("saved");
        window.setTimeout(() => {
          setSaveState((s) => (s === "saved" ? "idle" : s));
        }, 900);
      } catch (e: unknown) {
        setSaveState("error");
        setSaveError(getErrorMessage(e, "Failed to save"));
      }
    }, 800);

    return () => window.clearTimeout(timer);
  }, [dirtyFingerprint, isReady, local, noteId, update]);

  if (!local) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="retro-panel p-6 w-full max-w-2xl">
          <div className="text-sm muted">Loading note…</div>
          <div className="mt-3 h-2 rounded bg-[color-mix(in_oklab,var(--accent)_18%,transparent)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[color-mix(in_oklab,var(--border)_25%,transparent)] bg-[var(--surface)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[240px]">
            <input
              className="retro-input text-lg font-extrabold"
              value={local.title}
              placeholder="Note title…"
              onChange={(e) =>
                setLocal((n) => (n ? { ...n, title: e.target.value } : n))
              }
            />
            <div className="mt-2 flex items-center gap-2 text-sm muted">
              <span
                className={cx(
                  "retro-chip",
                  saveState === "saving" && "bg-[color-mix(in_oklab,var(--accent)_15%,var(--surface))]",
                  saveState === "error" && "bg-[color-mix(in_oklab,#ef4444_15%,var(--surface))]",
                )}
              >
                {demoMode ? "Demo mode" : "Backend"}
                {" • "}
                {saveState === "idle"
                  ? "Up to date"
                  : saveState === "dirty"
                    ? "Unsaved changes"
                    : saveState === "saving"
                      ? "Saving…"
                      : saveState === "saved"
                        ? "Saved"
                        : "Save error"}
              </span>
              {saveError ? <span className="text-[#EF4444]">{saveError}</span> : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={cx(
                "retro-btn",
                local.pinned && "retro-btn-primary",
              )}
              type="button"
              onClick={() => setLocal((n) => (n ? { ...n, pinned: !n.pinned } : n))}
              aria-pressed={local.pinned}
              title="Pin"
            >
              <span className="inline-flex items-center gap-2">
                <PinIcon className="opacity-90" />
                Pin
              </span>
            </button>
            <button
              className={cx(
                "retro-btn",
                local.favorite && "retro-btn-primary",
              )}
              type="button"
              onClick={() =>
                setLocal((n) => (n ? { ...n, favorite: !n.favorite } : n))
              }
              aria-pressed={local.favorite}
              title="Favorite"
            >
              <span className="inline-flex items-center gap-2">
                <StarIcon className="opacity-90" />
                Favorite
              </span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <TagChipsEditor
            tags={local.tags ?? []}
            onChange={(tags) => setLocal((n) => (n ? { ...n, tags } : n))}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2">
          {/* Editor */}
          <div className={cx("h-full flex flex-col", activePane !== "edit" && "hidden lg:flex")}>
            <div className="px-4 py-3 border-b border-[color-mix(in_oklab,var(--border)_25%,transparent)] bg-[var(--surface)] flex items-center justify-between">
              <div className="font-semibold">Editor</div>
              <div className="lg:hidden flex items-center gap-2">
                <button
                  className={cx("retro-btn", activePane === "edit" && "retro-btn-primary")}
                  onClick={() => setActivePane("edit")}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className={cx("retro-btn", activePane === "preview" && "retro-btn-primary")}
                  onClick={() => setActivePane("preview")}
                  type="button"
                >
                  Preview
                </button>
              </div>
            </div>
            <textarea
              className="flex-1 w-full resize-none bg-[var(--surface)] text-[var(--text)] p-4 font-mono text-sm outline-none"
              style={{ fontFamily: "var(--font-mono)" }}
              value={local.content}
              placeholder="Write markdown here…"
              onChange={(e) =>
                setLocal((n) => (n ? { ...n, content: e.target.value } : n))
              }
            />
          </div>

          {/* Preview */}
          <div className={cx("h-full flex flex-col", activePane !== "preview" && "hidden lg:flex")}>
            <div className="px-4 py-3 border-b border-[color-mix(in_oklab,var(--border)_25%,transparent)] bg-[var(--surface)] flex items-center justify-between">
              <div className="font-semibold">Preview</div>
              <div className="lg:hidden flex items-center gap-2">
                <button
                  className={cx("retro-btn", activePane === "edit" && "retro-btn-primary")}
                  onClick={() => setActivePane("edit")}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className={cx("retro-btn", activePane === "preview" && "retro-btn-primary")}
                  onClick={() => setActivePane("preview")}
                  type="button"
                >
                  Preview
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-[var(--surface)]">
              <MarkdownPreview markdown={local.content ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
