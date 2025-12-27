/**
 * Note entity types with Effect Schema for validation.
 */

import { Schema } from "@effect/schema";

// =============================================================================
// Schemas
// =============================================================================

/**
 * Note ID branded type for type safety.
 */
export const NoteId = Schema.String.pipe(Schema.brand("NoteId"));
export type NoteId = typeof NoteId.Type;

/**
 * Note schema with full validation.
 */
export const NoteSchema = Schema.Struct({
  id: NoteId,
  title: Schema.String.pipe(Schema.minLength(1)),
  content: Schema.String,
  createdAt: Schema.Number,
  updatedAt: Schema.Number,
});

export type Note = typeof NoteSchema.Type;

/**
 * Schema for creating a note.
 */
export const CreateNoteSchema = Schema.Struct({
  title: Schema.String.pipe(
    Schema.minLength(1, { message: () => "Title is required" })
  ),
  content: Schema.String,
});

export type CreateNote = typeof CreateNoteSchema.Type;

/**
 * Schema for updating a note.
 */
export const UpdateNoteSchema = Schema.Struct({
  id: NoteId,
  title: Schema.String.pipe(Schema.minLength(1)),
  content: Schema.String,
});

export type UpdateNote = typeof UpdateNoteSchema.Type;

// =============================================================================
// Parsing Functions
// =============================================================================

/**
 * Parse raw Convex response to Note.
 */
export function parseNote(data: Record<string, unknown>): Note {
  return {
    id: String(data._id ?? "") as NoteId,
    title: String(data.title ?? ""),
    content: String(data.content ?? ""),
    createdAt: Number(data.createdAt ?? 0),
    updatedAt: Number(data.updatedAt ?? 0),
  };
}

// =============================================================================
// Display Helpers
// =============================================================================

/**
 * Get short ID for display.
 */
export function shortId(id: string): string {
  return id.length > 12 ? id.slice(0, 12) : id;
}

/**
 * Get content preview (max 40 chars).
 */
export function contentPreview(content: string): string {
  return content.length > 40 ? `${content.slice(0, 40)}...` : content;
}

/**
 * Format timestamp to readable string.
 */
export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
