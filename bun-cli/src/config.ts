/**
 * Application configuration using Effect.Service pattern.
 */

import { Config, Effect } from "effect";

/**
 * Application configuration service.
 */
export class AppConfig extends Effect.Service<AppConfig>()("AppConfig", {
  effect: Effect.gen(function* () {
    const convexUrl = yield* Config.string("CONVEX_URL").pipe(
      Config.withDefault("http://127.0.0.1:3210"),
    );

    return {
      convexUrl,
    };
  }),
}) {}
