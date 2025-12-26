/**
 * Note service for business logic.
 */

import type { Note } from "../entity/note";
import type { NoteRepository } from "../repository/interface";

export class NoteService {
  constructor(private repository: NoteRepository) {}

  async list(): Promise<Note[]> {
    return this.repository.list();
  }

  async get(id: string): Promise<Note | null> {
    return this.repository.get(id);
  }

  async create(title: string, content: string): Promise<string> {
    return this.repository.create({ title, content });
  }

  async update(id: string, title: string, content: string): Promise<void> {
    return this.repository.update({ id, title, content });
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  subscribe(callback: (notes: Note[]) => void): () => void {
    return this.repository.subscribe(callback);
  }
}
