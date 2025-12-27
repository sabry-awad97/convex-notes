/**
 * Note service for business logic using Effect.
 */

import { Context, Effect, Layer } from "effect";
import type { Note, NoteId } from "../entity/note";
import { NotFoundError, type AppError } from "../errors";
import {
  NoteRepositoryTag,
  type RepositoryError,
} from "../repository/interface";

/**
 * NoteService interface.
 */
export interface NoteService {
  readonly list: () => Effect.Effect<Note[], RepositoryError>;
  readonly get: (id: NoteId) => Effect.Effect<Note, AppError>;
  readonly create: (
    title: string,
    content: string
  ) => Effect.Effect<NoteId, RepositoryError>;
  readonly update: (
    id: NoteId,
    title: string,
    content: string
  ) => Effect.Effect<void, RepositoryError>;
  readonly delete: (id: NoteId) => Effect.Effect<void, RepositoryError>;
  readonly subscribe: (
    callback: (notes: Note[]) => void
  ) => Effect.Effect<() => void, RepositoryError>;
}

/**
 * NoteService tag for dependency injection.
 */
export class NoteServiceTag extends Context.Tag("NoteService")<
  NoteServiceTag,
  NoteService
>() {}

/**
 * Live NoteService layer.
 */
export const NoteServiceLive = Layer.effect(
  NoteServiceTag,
  Effect.gen(function* () {
    const repo = yield* NoteRepositoryTag;

    const service: NoteService = {
      list: () => repo.list(),

      get: (id: NoteId) =>
        Effect.gen(function* () {
          const note = yield* repo.get(id);
          if (!note) {
            return yield* Effect.fail(
              new NotFoundError({
                message: `Note not found: ${id}`,
                resourceType: "Note",
                id,
              })
            );
          }
          return note;
        }),

      create: (title: string, content: string) =>
        repo.create({ title, content }),

      update: (id: NoteId, title: string, content: string) =>
        repo.update({ id, title, content }),

      delete: (id: NoteId) => repo.delete(id),

      subscribe: (callback: (notes: Note[]) => void) =>
        repo.subscribe(callback),
    };

    return service;
  })
);
