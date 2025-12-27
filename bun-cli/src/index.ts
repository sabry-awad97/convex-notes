/**
 * Entry point for the Convex Notes CLI using Effect.
 */

import { Effect, Layer } from "effect";
import pc from "picocolors";
import { run } from "./app";
import { AppConfig } from "./config";
import { NoteService } from "./service/note-service";

// =============================================================================
// Layer Composition - NoteService.Default already includes AppConfig
// =============================================================================

const MainLayer = Layer.merge(NoteService.Default, AppConfig.Default);

// =============================================================================
// Program
// =============================================================================

const program = Effect.gen(function* () {
  const config = yield* AppConfig;

  console.log(
    pc.cyan("🚀") + ` Connecting to ${pc.yellow(config.convexUrl)}...`,
  );
  console.log(pc.green("✅ Ready!\n"));

  yield* run;
});

// =============================================================================
// Execute
// =============================================================================

Effect.runPromise(program.pipe(Effect.provide(MainLayer))).catch((error) => {
  console.error(pc.red(`Fatal error: ${error}`));
  process.exit(1);
});
