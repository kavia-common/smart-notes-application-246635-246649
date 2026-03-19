"use client";

import React, { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

marked.setOptions({
  breaks: true,
  gfm: true,
});

// PUBLIC_INTERFACE
export default function MarkdownPreview({ markdown }: { markdown: string }) {
  /** Render markdown as sanitized HTML for preview. */
  const html = useMemo(() => {
    const raw = marked.parse(markdown ?? "") as string;
    return DOMPurify.sanitize(raw);
  }, [markdown]);

  return (
    <div
      className="markdown"
      // Sanitized by DOMPurify above.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
