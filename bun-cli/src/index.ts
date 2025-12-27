/**
 * Entry point for the Convex Notes CLI using Effect.
 */

import { Effect, Layer, ManagedRuntime } from "effect";
import pc from "picocolors";
import { run } from "./app";
import { AppConfig, AppConfigLive } from "./config";
import { ConvexRepositoryLive } from "./repository/convex";
import { NoteServiceLive } from "./service/note-service";

// =============================================================================
// Layer Composition
// =============================================================================

/**
 * Main application layer composing all dependencies.
 * ConfigLive -> ConvexRepositoryLive -> NoteServiceLive
 */
const MainLive = Layer.mergeAll(
  AppConfigLive,
  NoteServiceLive.pipe(
    Layer.provide(ConvexRepositoryLive),
    Layer.provide(AppConfigLive)
  )
);

// =============================================================================
// Program Execution with ManagedRuntime
// =============================================================================

const program = Effect.gen(function* () {
  const config = yield* AppConfig;

  console.log(
    pc.cyan("🚀") + ` Connecting to ${pc.yellow(config.convexUrl)}...`
  );
  console.log(pc.green("✅ Ready!\n"));

  yield* run;
});

// Create runtime and execute
const runtime = ManagedRuntime.make(MainLive);

runtime
  .runPromise(program)
  .catch((error) => {
    console.error(pc.red(`Fatal error: ${error}`));
    process.exit(1);
  })
  .finally(() => {
    runtime.dispose();
  });
