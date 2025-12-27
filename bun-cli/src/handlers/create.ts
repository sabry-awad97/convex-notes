/**
 * Create note handler using Effect.
 */

import * as p from "@clack/prompts";
import { Effect } from "effect";
import pc from "picocolors";
import { UserCancelledError, ValidationError } from "../errors";
import { NoteServiceTag } from "../service/note-service";

/**
 * Execute create command.
 */
export const execute = Effect.gen(function* () {
  console.log(pc.green("\n✏️ Create a new note"));

  const title = yield* Effect.tryPromise({
    try: () =>
      p.text({
        message: "Enter title:",
        placeholder: "My Note",
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
        message: "Enter content:",
        placeholder: "Note content...",
      }),
    catch: () =>
      new ValidationError({ message: "Failed to get content input" }),
  });

  if (p.isCancel(content)) {
    return yield* Effect.fail(new UserCancelledError({ message: "Cancelled" }));
  }

  const service = yield* NoteServiceTag;
  const id = yield* service.create(String(title), String(content));

  console.log(pc.green(`\n✅ Note created with ID: ${pc.cyan(id)}`));
});
