/**
 * Note entity types.
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateNote {
  title: string;
  content: string;
}

export interface UpdateNote {
  id: string;
  title: string;
  content: string;
}

/**
 * Parse Convex response to Note entity.
 */
export function parseNote(data: Record<string, unknown>): Note {
  return {
    id: String(data._id ?? ""),
    title: String(data.title ?? ""),
    content: String(data.content ?? ""),
    createdAt: Number(data.createdAt ?? 0),
    updatedAt: Number(data.updatedAt ?? 0),
  };
}

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
