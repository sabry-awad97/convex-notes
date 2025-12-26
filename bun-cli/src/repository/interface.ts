/**
 * Repository interface for note data access.
 */

import type { CreateNote, Note, UpdateNote } from "../entity/note";

export interface NoteRepository {
  list(): Promise<Note[]>;
  get(id: string): Promise<Note | null>;
  create(note: CreateNote): Promise<string>;
  update(note: UpdateNote): Promise<void>;
  delete(id: string): Promise<void>;
  subscribe(callback: (notes: Note[]) => void): () => void;
}
