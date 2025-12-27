/**
 * Application orchestration using Effect.
 */

import * as p from "@clack/prompts";
import { Effect } from "effect";
import pc from "picocolors";
import type { AppError } from "./errors";
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
 * Execute a handler and widen error type to AppError.
 */
const executeHandler = (
  choice: MenuChoice
): Effect.Effect<void, AppError, unknown> => {
  switch (choice) {
    case "list":
      return listHandler.execute;
    case "create":
      return createHandler.execute;
    case "update":
      return updateHandler.execute;
    case "delete":
      return deleteHandler.execute;
    case "watch":
      return watchHandler.execute;
    default:
      return Effect.void;
  }
};

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

    yield* executeHandler(choice).pipe(
      Effect.catchTags({
        UserCancelledError: () => Effect.void,
        ValidationError: (e) =>
          Effect.sync(() =>
            console.log(pc.yellow(`\n⚠️ Validation: ${e.message}`))
          ),
        ConvexError: (e) =>
          Effect.sync(() =>
            console.log(pc.red(`\n❌ API Error [${e.operation}]: ${e.message}`))
          ),
        NotFoundError: (e) =>
          Effect.sync(() =>
            console.log(pc.yellow(`\n⚠️ Not found: ${e.message}`))
          ),
        NetworkError: (e) =>
          Effect.sync(() =>
            console.log(pc.red(`\n🔌 Network Error: ${e.message}`))
          ),
      })
    );

    console.log();
  }
});
