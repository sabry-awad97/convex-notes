/**
 * Watch notes handler (real-time subscription).
 */

import pc from "picocolors";
import type { NoteService } from "../service/note-service";
import { displayNotes } from "../ui/table";

export async function execute(service: NoteService): Promise<void> {
  console.log(
    pc.magenta(pc.bold("\n👀 Watching notes for real-time updates...")),
  );
  console.log(pc.dim("   Press Ctrl+C to stop\n"));

  let unsubscribe: (() => void) | null = null;
  let stopped = false;

  // Set up Ctrl+C handler
  const handleInterrupt = () => {
    if (stopped) return;
    stopped = true;
    if (unsubscribe) {
      try {
        unsubscribe();
      } catch {
        // Ignore cleanup errors
      }
    }
    console.log(pc.magenta("\n👋 Stopped watching."));
    process.removeListener("SIGINT", handleInterrupt);
  };

  process.on("SIGINT", handleInterrupt);

  // Start subscription
  unsubscribe = service.subscribe((notes) => {
    if (stopped) return;
    console.log(pc.cyan("📨") + " " + pc.white("Update received:"));
    if (notes.length === 0) {
      console.log(pc.yellow("   No notes"));
    } else {
      displayNotes(notes);
    }
    console.log(pc.dim("─".repeat(50)));
  });

  // Wait until stopped
  while (!stopped) {
    await Bun.sleep(100);
  }
}
