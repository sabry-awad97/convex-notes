/**
 * Note service for business logic using Effect.Service.
 */

import { Effect } from "effect";
import type { CreateNote, Note, NoteId, UpdateNote } from "../entity/note";
import { NotFoundError } from "../errors";
import { NoteRepository } from "../repository/convex";
import type { RepositoryError } from "../repository/interface";

/**
 * NoteService interface.
 */
export interface NoteServiceShape {
  readonly list: () => Effect.Effect<Note[], RepositoryError>;
  readonly get: (
    id: NoteId,
  ) => Effect.Effect<Note, RepositoryError | NotFoundError>;
  readonly create: (
    title: string,
    content: string,
  ) => Effect.Effect<NoteId, RepositoryError>;
  readonly update: (
    id: NoteId,
    title: string,
    content: string,
  ) => Effect.Effect<void, RepositoryError>;
  readonly delete: (id: NoteId) => Effect.Effect<void, RepositoryError>;
  readonly subscribe: (
    callback: (notes: Note[]) => void,
  ) => Effect.Effect<() => void, RepositoryError>;
}

/**
 * NoteService using Effect.Service pattern.
 */
export class NoteService extends Effect.Service<NoteService>()("NoteService", {
  effect: Effect.gen(function* () {
    const repo = yield* NoteRepository;

    const service: NoteServiceShape = {
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
              }),
            );
          }
          return note;
        }),

      create: (title: string, content: string) =>
        repo.create({ title, content } as CreateNote),

      update: (id: NoteId, title: string, content: string) =>
        repo.update({ id, title, content } as UpdateNote),

      delete: (id: NoteId) => repo.delete(id),

      subscribe: (callback: (notes: Note[]) => void) =>
        repo.subscribe(callback),
    };

    return service;
  }),
  dependencies: [NoteRepository.Default],
}) {}
