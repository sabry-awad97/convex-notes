/**
 * Application errors with tagged union types for type-safe error handling.
 */

import { Data } from "effect";

/**
 * Network-related errors (connection failures, timeouts).
 */
export class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

/**
 * Convex API errors (query/mutation failures).
 */
export class ConvexError extends Data.TaggedError("ConvexError")<{
  readonly message: string;
  readonly operation: string;
  readonly cause?: unknown;
}> {}

/**
 * Validation errors for input data.
 */
export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string;
  readonly field?: string;
}> {}

/**
 * Resource not found errors.
 */
export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  readonly message: string;
  readonly resourceType: string;
  readonly id?: string;
}> {}

/**
 * User cancelled operation.
 */
export class UserCancelledError extends Data.TaggedError("UserCancelledError")<{
  readonly message: string;
}> {}

/**
 * Union type for all application errors.
 */
export type AppError =
  | NetworkError
  | ConvexError
  | ValidationError
  | NotFoundError
  | UserCancelledError;
