/**
 * Application orchestration.
 */

import * as p from "@clack/prompts";
import pc from "picocolors";
import * as createHandler from "./handlers/create";
import * as deleteHandler from "./handlers/delete";
import * as listHandler from "./handlers/list";
import * as updateHandler from "./handlers/update";
import * as watchHandler from "./handlers/watch";
import type { NoteService } from "./service/note-service";
import { printBanner } from "./ui/banner";

const MENU_OPTIONS = [
  { value: "list", label: "📋 List all notes" },
  { value: "create", label: "✏️  Create a new note" },
  { value: "update", label: "📝 Update a note" },
  { value: "delete", label: "🗑️  Delete a note" },
  { value: "watch", label: "👀 Watch notes (real-time)" },
  { value: "exit", label: "🚪 Exit" },
];

export async function run(service: NoteService): Promise<void> {
  printBanner();

  while (true) {
    const choice = await p.select({
      message: "What would you like to do?",
      options: MENU_OPTIONS,
    });

    if (p.isCancel(choice) || choice === "exit") {
      console.log(pc.magenta("\n👋 Goodbye!"));
      break;
    }

    try {
      switch (choice) {
        case "list":
          await listHandler.execute(service);
          break;
        case "create":
          await createHandler.execute(service);
          break;
        case "update":
          await updateHandler.execute(service);
          break;
        case "delete":
          await deleteHandler.execute(service);
          break;
        case "watch":
          await watchHandler.execute(service);
          break;
      }
    } catch (error) {
      console.log(pc.red(`\nError: ${error}`));
    }

    console.log();
  }
}
