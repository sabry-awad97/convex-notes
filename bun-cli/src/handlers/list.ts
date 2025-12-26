/**
 * List notes handler.
 */

import pc from "picocolors";
import type { NoteService } from "../service/note-service";
import { displayNotes } from "../ui/table";

export async function execute(service: NoteService): Promise<void> {
  console.log(pc.blue("\n📋 Fetching notes..."));

  const notes = await service.list();

  if (notes.length === 0) {
    console.log(pc.yellow("\n📭 No notes found. Create your first one!"));
  } else {
    console.log(pc.green(`\nFound ${pc.bold(String(notes.length))} note(s)`));
    displayNotes(notes);
  }
}
