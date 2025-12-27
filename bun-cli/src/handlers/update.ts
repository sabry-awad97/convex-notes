/**
 * Update note handler using Effect.
 */

import * as p from "@clack/prompts";
import { Effect } from "effect";
import pc from "picocolors";
import type { NoteId } from "../entity/note";
import { UserCancelledError, ValidationError } from "../errors";
import { NoteService } from "../service/note-service";

/**
 * Execute update command.
 */
export const execute = Effect.gen(function* () {
  console.log(pc.blue("\n📝 Update a note"));

  const service = yield* NoteService;
  const notes = yield* service.list();

  if (notes.length === 0) {
    console.log(pc.yellow("📭 No notes to update."));
    return;
  }

  const selected = yield* Effect.tryPromise({
    try: () =>
      p.select({
        message: "Select a note to update:",
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

  const title = yield* Effect.tryPromise({
    try: () =>
      p.text({
        message: "Enter new title:",
        initialValue: note?.title ?? "",
        validate: (value) => {
          if (!value.trim()) return "Title is required";
        },
      }),
    catch: () => new ValidationError({ message: "Failed to get title input" }),
  });

  if (p.isCancel(title)) {
    return yield* Effect.fail(new UserCancelledError({ message: "Cancelled" }));
  }

  const content = yield* Effect.tryPromise({
    try: () =>
      p.text({
        message: "Enter new content:",
        initialValue: note?.content ?? "",
      }),
    catch: () =>
      new ValidationError({ message: "Failed to get content input" }),
  });

  if (p.isCancel(content)) {
    return yield* Effect.fail(new UserCancelledError({ message: "Cancelled" }));
  }

  yield* service.update(noteId, String(title), String(content));

  console.log(pc.green(`\n✅ Note updated successfully!`));
});
