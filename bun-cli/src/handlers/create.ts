/**
 * Create note handler.
 */

import * as p from "@clack/prompts";
import pc from "picocolors";
import type { NoteService } from "../service/note-service";

export async function execute(service: NoteService): Promise<void> {
  console.log(pc.green(pc.bold("\n✏️ Create a new note")));

  const title = await p.text({
    message: "Title",
    validate: (value) => {
      if (!value.trim()) return "Title is required";
    },
  });

  if (p.isCancel(title)) {
    console.log(pc.yellow("Cancelled."));
    return;
  }

  const content = await p.text({
    message: "Content",
    validate: (value) => {
      if (!value.trim()) return "Content is required";
    },
  });

  if (p.isCancel(content)) {
    console.log(pc.yellow("Cancelled."));
    return;
  }

  try {
    const id = await service.create(title, content);
    console.log(pc.green(`\n✅ Note '${pc.yellow(title)}' created!`));
    console.log(pc.dim(`   ID: ${id}`));
  } catch (error) {
    console.log(pc.red(`❌ Failed to create note: ${error}`));
  }
}
