/**
 * Delete note handler.
 */

import * as p from "@clack/prompts";
import pc from "picocolors";
import type { NoteService } from "../service/note-service";

export async function execute(service: NoteService): Promise<void> {
  console.log(pc.red(pc.bold("\n🗑️ Delete a note")));

  const notes = await service.list();

  if (notes.length === 0) {
    console.log(pc.yellow("📭 No notes to delete."));
    return;
  }

  const options = notes.map((note) => ({
    value: note.id,
    label: note.title,
  }));

  const selectedId = await p.select({
    message: "Select a note to delete",
    options,
  });

  if (p.isCancel(selectedId)) {
    console.log(pc.yellow("Cancelled."));
    return;
  }

  const selected = notes.find((n) => n.id === selectedId)!;

  const confirmed = await p.confirm({
    message: `Are you sure you want to delete '${pc.yellow(selected.title)}'?`,
    initialValue: false,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    console.log(pc.yellow("Cancelled."));
    return;
  }

  try {
    await service.delete(selectedId as string);
    console.log(
      pc.green(
        `\n✅ Note '${pc.strikethrough(pc.red(selected.title))}' deleted.`,
      ),
    );
  } catch (error) {
    console.log(pc.red(`❌ Failed to delete note: ${error}`));
  }
}
