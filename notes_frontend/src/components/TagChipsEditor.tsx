"use client";

import React, { useMemo, useState } from "react";
import { cx } from "@/lib/utils";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

// PUBLIC_INTERFACE
export default function TagChipsEditor({ tags, onChange }: Props) {
  /** Edit tags as chips: add via input and remove by clicking X. */
  const normalized = useMemo(
    () => (tags ?? []).map((t) => t.trim()).filter(Boolean),
    [tags],
  );
  const [value, setValue] = useState("");

  function addTag(raw: string) {
    const t = raw.trim();
    if (!t) return;
    if (normalized.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    onChange([...normalized, t]);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {normalized.map((t) => (
        <span key={t} className="retro-chip">
          <span className="font-medium">#{t}</span>
          <button
            type="button"
            className={cx(
              "retro-btn !px-2 !py-1 !rounded-full",
              "bg-transparent",
            )}
            aria-label={`Remove tag ${t}`}
            onClick={() => onChange(normalized.filter((x) => x !== t))}
          >
            ×
          </button>
        </span>
      ))}

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addTag(value);
          setValue("");
        }}
      >
        <input
          className="retro-input !w-44 !py-2 !px-3"
          value={value}
          placeholder="Add tag…"
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="retro-btn"
          type="submit"
          aria-label="Add tag"
          title="Add tag"
        >
          Add
        </button>
      </form>
    </div>
  );
}
