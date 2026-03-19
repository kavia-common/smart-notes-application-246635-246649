"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Note, NoteId, TagSummary } from "@/lib/types";
import {
  apiCreateNote,
  apiDeleteNote,
  apiGetNote,
  apiListNotes,
  apiUpdateNote,
} from "@/lib/api";
import { readJsonStorage, writeJsonStorage } from "@/lib/storage";
import { useAuth } from "@/contexts/auth";
import { getErrorMessage } from "@/lib/errors";

type NotesContextValue = {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  demoMode: boolean;

  query: string;
  setQuery: (q: string) => void;

  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;

  onlyPinned: boolean;
  setOnlyPinned: (v: boolean) => void;

  onlyFavorites: boolean;
  setOnlyFavorites: (v: boolean) => void;

  tags: TagSummary[];

  getById: (id: NoteId) => Note | undefined;
  ensureLoaded: (id: NoteId) => Promise<Note | null>;

  refresh: () => Promise<void>;
  create: () => Promise<NoteId | null>;
  update: (
    id: NoteId,
    patch: Partial<Pick<Note, "title" | "content" | "tags" | "pinned" | "favorite">>,
  ) => Promise<Note | null>;
  remove: (id: NoteId) => Promise<boolean>;
};

const NotesContext = createContext<NotesContextValue | null>(null);

const DEMO_STORAGE_KEY = "smart_notes_demo_notes";

function nowIso() {
  return new Date().toISOString();
}

function seedDemoNotes(): Note[] {
  const t = nowIso();
  return [
    {
      id: "demo-1",
      title: "Welcome to Smart Notes",
      content:
        "# Hello!\n\nThis is a **retro-styled** notes app.\n\n- Tags\n- Pin / Favorite\n- Markdown preview\n- Debounced autosave\n\n> Tip: Use the search box to filter notes.",
      tags: ["welcome", "tips"],
      pinned: true,
      favorite: false,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "demo-2",
      title: "Markdown cheat sheet",
      content:
        "## Formatting\n\n- `**bold**`\n- `_italic_`\n- `# heading`\n- `> quote`\n\n```js\nconsole.log('retro!')\n```",
      tags: ["markdown"],
      pinned: false,
      favorite: true,
      createdAt: t,
      updatedAt: t,
    },
  ];
}

function deriveTags(notes: Note[]): TagSummary[] {
  const counts = new Map<string, number>();
  for (const n of notes) {
    for (const tag of n.tags ?? []) {
      const key = tag.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }: { children: React.ReactNode }) {
  /** Provides notes state (CRUD/search/tags) and integrates with backend API. */
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const tags = useMemo(() => deriveTags(notes), [notes]);

  const getById = (id: NoteId) => notes.find((n) => String(n.id) === String(id));

  async function loadDemo() {
    const stored = readJsonStorage<Note[]>(DEMO_STORAGE_KEY);
    const demo = stored?.length ? stored : seedDemoNotes();
    setNotes(demo);
    writeJsonStorage(DEMO_STORAGE_KEY, demo);
    setDemoMode(true);
  }

  async function refresh() {
    setError(null);
    if (!token) {
      setNotes([]);
      setDemoMode(false);
      return;
    }
    setIsLoading(true);
    try {
      const items = await apiListNotes(token);
      setNotes(items ?? []);
      setDemoMode(false);
    } catch (e: unknown) {
      // Backend not ready yet: keep UI usable with demo data.
      setError(getErrorMessage(e, "Failed to load notes"));
      await loadDemo();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Load notes when token becomes available.
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function ensureLoaded(id: NoteId): Promise<Note | null> {
    const existing = getById(id);
    if (existing) return existing;

    if (!token) return null;

    try {
      const note = await apiGetNote(token, String(id));
      setNotes((prev) => {
        const next = prev.filter((n) => String(n.id) !== String(id));
        return [note, ...next].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      });
      return note;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to load note"));
      return null;
    }
  }

  async function create(): Promise<NoteId | null> {
    setError(null);
    if (!token) return null;

    const optimistic: Note = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `tmp-${Date.now()}`,
      title: "Untitled",
      content: "",
      tags: [],
      pinned: false,
      favorite: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    // Optimistically insert so UI is instant.
    setNotes((prev) => [optimistic, ...prev]);

    try {
      const created = await apiCreateNote(token, {
        title: optimistic.title,
        content: optimistic.content,
        tags: optimistic.tags,
        pinned: optimistic.pinned,
        favorite: optimistic.favorite,
      });

      setNotes((prev) =>
        [created, ...prev.filter((n) => String(n.id) !== String(optimistic.id))].sort(
          (a, b) => b.updatedAt.localeCompare(a.updatedAt),
        ),
      );

      return String(created.id);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to create note"));
      // Remove optimistic note if backend fails.
      setNotes((prev) => prev.filter((n) => String(n.id) !== String(optimistic.id)));
      return null;
    }
  }

  async function update(
    id: NoteId,
    patch: Partial<Pick<Note, "title" | "content" | "tags" | "pinned" | "favorite">>,
  ): Promise<Note | null> {
    setError(null);

    // Optimistic update
    const prevNote = getById(id);
    if (prevNote) {
      const next: Note = {
        ...prevNote,
        ...patch,
        updatedAt: nowIso(),
      };
      setNotes((prev) =>
        prev
          .map((n) => (String(n.id) === String(id) ? next : n))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      );

      // Demo mode persists locally
      if (demoMode) {
        const nextAll = notes
          .map((n) => (String(n.id) === String(id) ? next : n))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        writeJsonStorage(DEMO_STORAGE_KEY, nextAll);
        return next;
      }
    }

    if (!token) return prevNote ?? null;

    try {
      const saved = await apiUpdateNote(token, String(id), patch);
      setNotes((prev) =>
        prev
          .map((n) => (String(n.id) === String(id) ? saved : n))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      );
      return saved;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to save note"));
      // Revert on failure
      if (prevNote) {
        setNotes((prev) => prev.map((n) => (String(n.id) === String(id) ? prevNote : n)));
      }
      return null;
    }
  }

  async function remove(id: NoteId): Promise<boolean> {
    setError(null);

    const before = notes;
    setNotes((prev) => prev.filter((n) => String(n.id) !== String(id)));

    if (demoMode) {
      const nextAll = before.filter((n) => String(n.id) !== String(id));
      writeJsonStorage(DEMO_STORAGE_KEY, nextAll);
      return true;
    }

    if (!token) return false;

    try {
      await apiDeleteNote(token, String(id));
      return true;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to delete note"));
      // revert
      setNotes(before);
      return false;
    }
  }

  const value: NotesContextValue = {
    notes,
    isLoading,
    error,
    demoMode,
    query,
    setQuery,
    activeTag,
    setActiveTag,
    onlyPinned,
    setOnlyPinned,
    onlyFavorites,
    setOnlyFavorites,
    tags,
    getById,
    ensureLoaded,
    refresh,
    create,
    update,
    remove,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes(): NotesContextValue {
  /** Access the NotesContext. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}
