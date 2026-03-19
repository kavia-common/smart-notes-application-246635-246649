"use client";

import React from "react";
import { useNotes } from "@/contexts/notes";
import { cx } from "@/lib/utils";

type ItemProps = {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
};

function Item({ label, active, count, onClick }: ItemProps) {
  return (
    <button
      type="button"
      className={cx(
        "w-full text-left px-3 py-2 rounded-xl border-2",
        active
          ? "bg-[color-mix(in_oklab,var(--accent)_18%,var(--surface))] border-[var(--border)]"
          : "bg-[var(--surface)] border-[color-mix(in_oklab,var(--border)_20%,transparent)]",
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{label}</span>
        {typeof count === "number" ? (
          <span className="retro-chip">{count}</span>
        ) : null}
      </div>
    </button>
  );
}

// PUBLIC_INTERFACE
export default function TagSidebar() {
  /** Left sidebar: tag navigation + quick filters. */
  const {
    notes,
    tags,
    activeTag,
    setActiveTag,
    onlyPinned,
    setOnlyPinned,
    onlyFavorites,
    setOnlyFavorites,
  } = useNotes();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[color-mix(in_oklab,var(--border)_25%,transparent)]">
        <div className="text-sm muted">Navigation</div>
        <div className="mt-2 font-extrabold text-lg">Tags</div>
      </div>

      <div className="p-4 space-y-2 overflow-auto">
        <Item
          label="All notes"
          active={!activeTag && !onlyPinned && !onlyFavorites}
          count={notes.length}
          onClick={() => {
            setActiveTag(null);
            setOnlyPinned(false);
            setOnlyFavorites(false);
          }}
        />
        <Item
          label="Pinned"
          active={onlyPinned}
          count={notes.filter((n) => n.pinned).length}
          onClick={() => {
            setOnlyPinned(true);
            setOnlyFavorites(false);
            setActiveTag(null);
          }}
        />
        <Item
          label="Favorites"
          active={onlyFavorites}
          count={notes.filter((n) => n.favorite).length}
          onClick={() => {
            setOnlyFavorites(true);
            setOnlyPinned(false);
            setActiveTag(null);
          }}
        />

        <div className="pt-4">
          <div className="text-xs muted mb-2">By tag</div>
          <div className="space-y-2">
            {tags.length ? (
              tags.map((t) => (
                <Item
                  key={t.name}
                  label={`#${t.name}`}
                  count={t.count}
                  active={activeTag === t.name}
                  onClick={() => {
                    setActiveTag(t.name);
                    setOnlyPinned(false);
                    setOnlyFavorites(false);
                  }}
                />
              ))
            ) : (
              <div className="retro-panel p-3 text-sm muted">
                No tags yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
