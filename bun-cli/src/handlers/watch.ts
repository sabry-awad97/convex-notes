/**
 * Watch notes handler using Effect (real-time updates).
 */

import { Effect } from "effect";
import pc from "picocolors";
import { NoteService } from "../service/note-service";
import { printNotesTable } from "../ui/table";

/**
 * Execute watch command.
 */
export const execute = Effect.gen(function* () {
  console.log(pc.magenta("\n👀 Watching notes (press Ctrl+C to stop)...\n"));

  const service = yield* NoteService;

  const unsubscribe = yield* service.subscribe((notes) => {
    console.clear();
    console.log(pc.magenta("👀 Real-time Notes (Ctrl+C to stop)\n"));

    if (notes.length === 0) {
      console.log(pc.yellow("📭 No notes yet."));
    } else {
      printNotesTable(notes);
    }
  });

  // Wait for interrupt
  yield* Effect.async<void, never>((resume) => {
    process.on("SIGINT", () => {
      unsubscribe();
      console.log(pc.yellow("\n\n👋 Stopped watching."));
      resume(Effect.succeed(undefined));
    });
  });
});
