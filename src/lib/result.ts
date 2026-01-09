// /workspaces/claude-workspace/fitnessapp/src/lib/result.ts

/**
 * Result type for operations that can succeed or fail
 * Provides type-safe error handling without exceptions
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Create a success result
 */
export const success = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

/**
 * Create a failure result
 */
export const failure = <E = Error>(error: E): Result<never, E> => ({
  success: false,
  error,
});

/**
 * Wrap an async function in a try-catch and return a Result
 */
export const tryCatch = async <T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> => {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * Wrap a sync function in a try-catch and return a Result
 */
export const tryCatchSync = <T>(fn: () => T): Result<T, Error> => {
  try {
    const data = fn();
    return success(data);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * Check if a Result is successful
 */
export const isSuccess = <T, E>(
  result: Result<T, E>
): result is { success: true; data: T } => {
  return result.success === true;
};

/**
 * Check if a Result is a failure
 */
export const isFailure = <T, E>(
  result: Result<T, E>
): result is { success: false; error: E } => {
  return result.success === false;
};

/**
 * Map over a successful result
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> => {
  if (result.success) {
    return success(fn(result.data));
  }
  return result;
};

/**
 * FlatMap over a successful result
 */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> => {
  if (result.success) {
    return fn(result.data);
  }
  return result;
};

/**
 * Get data from result or return default value
 */
export const getOrDefault = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return result.success ? result.data : defaultValue;
};

/**
 * Get data from result or throw error
 */
export const getOrThrow = <T, E extends Error>(result: Result<T, E>): T => {
  if (result.success) {
    return result.data;
  }
  throw result.error;
};
