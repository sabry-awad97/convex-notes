/**
 * Convex implementation of NoteRepository.
 */

import { ConvexClient, ConvexHttpClient } from "convex/browser";
import type { CreateNote, Note, UpdateNote } from "../entity/note";
import { parseNote } from "../entity/note";
import type { NoteRepository } from "./interface";

export class ConvexNoteRepository implements NoteRepository {
  private httpClient: ConvexHttpClient;
  private wsClient: ConvexClient;

  constructor(url: string) {
    this.httpClient = new ConvexHttpClient(url);
    this.wsClient = new ConvexClient(url);
  }

  async list(): Promise<Note[]> {
    const result = await this.httpClient.query("notes:list" as any, {});
    return (result as unknown[]).map((item) =>
      parseNote(item as Record<string, unknown>),
    );
  }

  async get(id: string): Promise<Note | null> {
    const result = await this.httpClient.query("notes:get" as any, { id });
    if (!result) return null;
    return parseNote(result as Record<string, unknown>);
  }

  async create(note: CreateNote): Promise<string> {
    const result = await this.httpClient.mutation("notes:create" as any, {
      title: note.title,
      content: note.content,
    });
    return String(result);
  }

  async update(note: UpdateNote): Promise<void> {
    await this.httpClient.mutation("notes:update" as any, {
      id: note.id,
      title: note.title,
      content: note.content,
    });
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.mutation("notes:remove" as any, { id });
  }

  subscribe(callback: (notes: Note[]) => void): () => void {
    return this.wsClient.onUpdate("notes:list" as any, {}, (result) => {
      const notes = (result as unknown[]).map((item) =>
        parseNote(item as Record<string, unknown>),
      );
      callback(notes);
    });
  }
}
