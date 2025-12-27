/**
 * Repository interface for note data access using Effect.
 */

import { Effect } from "effect";
import type { CreateNote, Note, NoteId, UpdateNote } from "../entity/note";
import type { ConvexError, NetworkError } from "../errors";

/**
 * Repository error type.
 */
export type RepositoryError = ConvexError | NetworkError;

/**
 * NoteRepository service interface.
 */
export interface NoteRepositoryShape {
  readonly list: () => Effect.Effect<Note[], RepositoryError>;
  readonly get: (id: NoteId) => Effect.Effect<Note | null, RepositoryError>;
  readonly create: (note: CreateNote) => Effect.Effect<NoteId, RepositoryError>;
  readonly update: (note: UpdateNote) => Effect.Effect<void, RepositoryError>;
  readonly delete: (id: NoteId) => Effect.Effect<void, RepositoryError>;
  readonly subscribe: (
    callback: (notes: Note[]) => void,
  ) => Effect.Effect<() => void, RepositoryError>;
}
