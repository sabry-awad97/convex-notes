/**
 * List notes handler using Effect.
 */

import { Effect } from "effect";
import pc from "picocolors";
import { NoteServiceTag } from "../service/note-service";
import { printNotesTable } from "../ui/table";

/**
 * Execute list command.
 */
export const execute = Effect.gen(function* () {
  console.log(pc.cyan("\n📋 Fetching notes..."));

  const service = yield* NoteServiceTag;
  const notes = yield* service.list();

  if (notes.length === 0) {
    console.log(pc.yellow("📭 No notes found."));
    return;
  }

  console.log(pc.green(`\nFound ${notes.length} note(s)\n`));
  printNotesTable(notes);
});
