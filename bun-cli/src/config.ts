/**
 * Application configuration using Effect Config.
 */

import { Config, Context, Layer } from "effect";

/**
 * Application configuration schema.
 */
export class AppConfig extends Context.Tag("AppConfig")<
  AppConfig,
  {
    readonly convexUrl: string;
  }
>() {}

/**
 * Load configuration from environment.
 */
export const AppConfigLive = Layer.effect(
  AppConfig,
  Config.all({
    convexUrl: Config.string("CONVEX_URL").pipe(
      Config.withDefault("http://127.0.0.1:3210")
    ),
  })
);
