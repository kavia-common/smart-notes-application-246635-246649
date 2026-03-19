import React from "react";
import NoteEditor from "@/components/NoteEditor";

// PUBLIC_INTERFACE
export default async function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /** Dynamic note editor route. */
  const { id } = await params;
  return <NoteEditor noteId={id} />;
}
