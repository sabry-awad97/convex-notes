/**
 * Update note handler.
 */

import * as p from "@clack/prompts";
import pc from "picocolors";
import type { NoteService } from "../service/note-service";

export async function execute(service: NoteService): Promise<void> {
  console.log(pc.blue(pc.bold("\n📝 Update a note")));

  const notes = await service.list();

  if (notes.length === 0) {
    console.log(pc.yellow("📭 No notes to update."));
    return;
  }

  const options = notes.map((note) => ({
    value: note.id,
    label: note.title,
  }));

  const selectedId = await p.select({
    message: "Select a note to update",
    options,
  });

  if (p.isCancel(selectedId)) {
    console.log(pc.yellow("Cancelled."));
    return;
  }

  const selected = notes.find((n) => n.id === selectedId)!;

  const title = await p.text({
    message: "New title",
    initialValue: selected.title,
  });

  if (p.isCancel(title)) return;

  const content = await p.text({
    message: "New content",
    initialValue: selected.content,
  });

  if (p.isCancel(content)) return;

  try {
    await service.update(selectedId as string, title, content);
    console.log(pc.green("\n✅ Note updated successfully!"));
  } catch (error) {
    console.log(pc.red(`❌ Failed to update note: ${error}`));
  }
}
