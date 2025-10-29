import { APIError } from "@shared/data/Auth/interfaces";

/**
 * Extract user-friendly error message from API errors
 *
 * Handles:
 * - APIError instances with structured error body
 * - Generic Error objects
 * - Unknown error types
 *
 * @param error - Error from API call
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  // Handle APIError instances
  if (error instanceof APIError) {
    // Try to extract message from error body
    if (error.body?.error) {
      return error.body.error;
    }
    if (error.body?.message) {
      return error.body.message;
    }
    // Fallback to APIError message
    return error.message;
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Unknown error type
  return "Wystąpił nieznany błąd";
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatus(error: unknown): number | null {
  if (error instanceof APIError) {
    return error.status;
  }
  return null;
}

/**
 * Check if error is authentication related (401, 403)
 */
export function isAuthError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
}

/**
 * Check if error is validation error (400)
 */
export function isValidationError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 400;
}
