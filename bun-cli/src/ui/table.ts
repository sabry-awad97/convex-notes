/**
 * Table display for notes.
 */

import pc from "picocolors";
import type { Note } from "../entity/note";
import { contentPreview, formatTimestamp, shortId } from "../entity/note";

export function printNotesTable(notes: Note[]): void {
  if (notes.length === 0) {
    console.log(pc.yellow("📭 No notes found."));
    return;
  }

  // Header
  console.log();
  console.log(
    pc.bold(pc.cyan("ID".padEnd(14))) +
      pc.bold(pc.yellow("Title".padEnd(20))) +
      pc.bold(pc.white("Content".padEnd(45))) +
      pc.bold(pc.magenta("Created")),
  );
  console.log(pc.dim("─".repeat(95)));

  // Rows
  for (const note of notes) {
    console.log(
      pc.cyan(shortId(note.id).padEnd(14)) +
        pc.yellow(note.title.slice(0, 18).padEnd(20)) +
        contentPreview(note.content).padEnd(45) +
        pc.magenta(formatTimestamp(note.createdAt)),
    );
  }
  console.log();
}
