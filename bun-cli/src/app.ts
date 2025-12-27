/**
 * Application orchestration using Effect.
 */

import * as p from "@clack/prompts";
import { Effect } from "effect";
import pc from "picocolors";
import * as createHandler from "./handlers/create";
import * as deleteHandler from "./handlers/delete";
import * as listHandler from "./handlers/list";
import * as updateHandler from "./handlers/update";
import * as watchHandler from "./handlers/watch";
import { printBanner } from "./ui/banner";

const MENU_OPTIONS = [
  { value: "list", label: "📋 List all notes" },
  { value: "create", label: "✏️  Create a new note" },
  { value: "update", label: "📝 Update a note" },
  { value: "delete", label: "🗑️  Delete a note" },
  { value: "watch", label: "👀 Watch notes (real-time)" },
  { value: "exit", label: "🚪 Exit" },
] as const;

type MenuChoice = (typeof MENU_OPTIONS)[number]["value"];

/**
 * Main application loop using Effect.
 */
export const run = Effect.gen(function* () {
  printBanner();

  while (true) {
    const choice = yield* Effect.tryPromise({
      try: () =>
        p.select({
          message: "What would you like to do?",
          options: [...MENU_OPTIONS],
        }),
      catch: (e) => new Error(`Menu error: ${e}`),
    });

    if (p.isCancel(choice) || choice === "exit") {
      console.log(pc.magenta("\n👋 Goodbye!"));
      break;
    }

    const result = yield* Effect.gen(function* () {
      switch (choice as MenuChoice) {
        case "list":
          return yield* listHandler.execute;
        case "create":
          return yield* createHandler.execute;
        case "update":
          return yield* updateHandler.execute;
        case "delete":
          return yield* deleteHandler.execute;
        case "watch":
          return yield* watchHandler.execute;
        default:
          return;
      }
    }).pipe(
      Effect.catchTag("UserCancelledError", () => Effect.succeed(undefined)),
      Effect.catchAll((error) => {
        console.log(pc.red(`\n❌ Error: ${error}`));
        return Effect.succeed(undefined);
      })
    );

    console.log();
  }
});
