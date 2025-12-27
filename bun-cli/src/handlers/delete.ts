/**
 * Delete note handler using Effect.
 */

import * as p from "@clack/prompts";
import { Effect } from "effect";
import pc from "picocolors";
import type { NoteId } from "../entity/note";
import { UserCancelledError, ValidationError } from "../errors";
import { NoteService } from "../service/note-service";

/**
 * Execute delete command.
 */
export const execute = Effect.gen(function* () {
  console.log(pc.red("\n🗑️ Delete a note"));

  const service = yield* NoteService;
  const notes = yield* service.list();

  if (notes.length === 0) {
    console.log(pc.yellow("📭 No notes to delete."));
    return;
  }

  const selected = yield* Effect.tryPromise({
    try: () =>
      p.select({
        message: "Select a note to delete:",
        options: notes.map((n) => ({
          value: n.id,
          label: n.title,
          hint: n.content.slice(0, 30),
        })),
      }),
    catch: () => new ValidationError({ message: "Failed to select note" }),
  });

  if (p.isCancel(selected)) {
    return yield* Effect.fail(new UserCancelledError({ message: "Cancelled" }));
  }

  const noteId = selected as NoteId;
  const note = notes.find((n) => n.id === noteId);

  const confirmed = yield* Effect.tryPromise({
    try: () =>
      p.confirm({
        message: `Are you sure you want to delete "${note?.title}"?`,
      }),
    catch: () => new ValidationError({ message: "Failed to confirm" }),
  });

  if (p.isCancel(confirmed) || !confirmed) {
    console.log(pc.yellow("Cancelled."));
    return;
  }

  yield* service.delete(noteId);

  console.log(pc.green(`\n✅ Note "${note?.title}" deleted.`));
});
