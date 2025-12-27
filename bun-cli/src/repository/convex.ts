/**
 * Convex implementation of NoteRepository using Effect.
 */

import { ConvexClient, ConvexHttpClient } from "convex/browser";
import { Effect, Layer } from "effect";
import { AppConfig } from "../config";
import type { CreateNote, Note, NoteId, UpdateNote } from "../entity/note";
import { parseNote } from "../entity/note";
import { ConvexError } from "../errors";
import { NoteRepositoryTag, type NoteRepository } from "./interface";

/**
 * Create a Convex repository implementation.
 */
function makeConvexRepository(url: string): NoteRepository {
  const httpClient = new ConvexHttpClient(url);
  // Lazy WebSocket client - only created when subscribe() is called
  let wsClient: ConvexClient | null = null;

  const getWsClient = () => {
    if (!wsClient) {
      wsClient = new ConvexClient(url);
    }
    return wsClient;
  };

  return {
    list: () =>
      Effect.tryPromise({
        try: async () => {
          const result = await httpClient.query("notes:list" as any, {});
          return (result as unknown[]).map((item) =>
            parseNote(item as Record<string, unknown>)
          );
        },
        catch: (error) =>
          new ConvexError({
            message: String(error),
            operation: "list",
            cause: error,
          }),
      }),

    get: (id: NoteId) =>
      Effect.tryPromise({
        try: async () => {
          const result = await httpClient.query("notes:get" as any, { id });
          if (!result) return null;
          return parseNote(result as Record<string, unknown>);
        },
        catch: (error) =>
          new ConvexError({
            message: String(error),
            operation: "get",
            cause: error,
          }),
      }),

    create: (note: CreateNote) =>
      Effect.tryPromise({
        try: async () => {
          const result = await httpClient.mutation("notes:create" as any, {
            title: note.title,
            content: note.content,
          });
          return String(result) as NoteId;
        },
        catch: (error) =>
          new ConvexError({
            message: String(error),
            operation: "create",
            cause: error,
          }),
      }),

    update: (note: UpdateNote) =>
      Effect.tryPromise({
        try: async () => {
          await httpClient.mutation("notes:update" as any, {
            id: note.id,
            title: note.title,
            content: note.content,
          });
        },
        catch: (error) =>
          new ConvexError({
            message: String(error),
            operation: "update",
            cause: error,
          }),
      }),

    delete: (id: NoteId) =>
      Effect.tryPromise({
        try: async () => {
          await httpClient.mutation("notes:remove" as any, { id });
        },
        catch: (error) =>
          new ConvexError({
            message: String(error),
            operation: "delete",
            cause: error,
          }),
      }),

    subscribe: (callback: (notes: Note[]) => void) =>
      Effect.sync(() => {
        return getWsClient().onUpdate("notes:list" as any, {}, (result) => {
          const notes = (result as unknown[]).map((item) =>
            parseNote(item as Record<string, unknown>)
          );
          callback(notes);
        });
      }),
  };
}

/**
 * Live layer for ConvexRepository - depends on AppConfig.
 */
export const ConvexRepositoryLive = Layer.effect(
  NoteRepositoryTag,
  Effect.gen(function* () {
    const config = yield* AppConfig;
    return makeConvexRepository(config.convexUrl);
  })
);
