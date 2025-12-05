/**
 * Authentication Error Types
 *
 * Standardized error codes and schemas for authentication flows.
 * Maps Better Auth errors to our application-specific error codes.
 */

import { z } from "zod";

/**
 * Standard authentication error codes
 *
 * These codes provide a consistent error interface across
 * all authentication operations, regardless of the underlying
 * authentication provider (Better Auth, OAuth, etc.)
 */
export const AuthErrorCodeSchema = z.enum([
	"INVALID_CREDENTIALS",
	"USER_NOT_FOUND",
	"EMAIL_NOT_VERIFIED",
	"SESSION_EXPIRED",
	"UNAUTHORIZED",
	"RATE_LIMITED",
	"INVALID_TOKEN",
	"USER_ALREADY_EXISTS",
	"WEAK_PASSWORD",
	"INVALID_EMAIL",
	"OAUTH_ERROR",
	"NETWORK_ERROR",
	"UNKNOWN_ERROR",
]);

export type AuthErrorCode = z.infer<typeof AuthErrorCodeSchema>;

/**
 * Authentication error schema
 *
 * Provides structured error information for frontend display
 * and logging purposes.
 *
 * @example
 * ```typescript
 * const result = await signIn(email, password);
 * if (result.error) {
 *   console.error(`Auth failed: ${result.error.message}`);
 *   if (result.error.code === 'INVALID_CREDENTIALS') {
 *     showToast('Invalid email or password');
 *   }
 * }
 * ```
 */
export const AuthErrorSchema = z.object({
	code: AuthErrorCodeSchema,
	message: z.string(),
	details: z.record(z.string(), z.unknown()).optional(),
});

export type AuthError = z.infer<typeof AuthErrorSchema>;

/**
 * Map Better Auth error messages to our error codes
 *
 * Better Auth returns string error messages. This map translates
 * them to our standardized error codes for consistent handling.
 */
export const BETTER_AUTH_ERROR_MAP: Record<string, AuthErrorCode> = {
	// Sign in errors
	INVALID_PASSWORD: "INVALID_CREDENTIALS",
	USER_NOT_FOUND: "USER_NOT_FOUND",
	INVALID_EMAIL: "INVALID_EMAIL",

	// Sign up errors
	USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
	EMAIL_ALREADY_IN_USE: "USER_ALREADY_EXISTS",
	WEAK_PASSWORD: "WEAK_PASSWORD",

	// Session errors
	SESSION_EXPIRED: "SESSION_EXPIRED",
	SESSION_NOT_FOUND: "SESSION_EXPIRED",
	INVALID_SESSION: "SESSION_EXPIRED",

	// Verification errors
	EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",

	// Token errors
	INVALID_TOKEN: "INVALID_TOKEN",
	TOKEN_EXPIRED: "INVALID_TOKEN",

	// Rate limiting
	RATE_LIMIT_EXCEEDED: "RATE_LIMITED",
	TOO_MANY_REQUESTS: "RATE_LIMITED",

	// OAuth errors
	OAUTH_ERROR: "OAUTH_ERROR",
	OAUTH_CALLBACK_ERROR: "OAUTH_ERROR",
	PROVIDER_ERROR: "OAUTH_ERROR",
};

/**
 * Helper function to map Better Auth errors to our error codes
 *
 * @param betterAuthError - Error message or code from Better Auth
 * @returns Mapped error code or UNKNOWN_ERROR
 *
 * @example
 * ```typescript
 * const errorCode = mapBetterAuthError('INVALID_PASSWORD');
 * // Returns: 'INVALID_CREDENTIALS'
 * ```
 */
export function mapBetterAuthError(betterAuthError: string): AuthErrorCode {
	return BETTER_AUTH_ERROR_MAP[betterAuthError] || "UNKNOWN_ERROR";
}

/**
 * Create a standardized auth error
 *
 * @param code - Error code
 * @param message - User-friendly error message
 * @param details - Optional additional error details
 * @returns AuthError object
 *
 * @example
 * ```typescript
 * throw createAuthError(
 *   'INVALID_CREDENTIALS',
 *   'The email or password you entered is incorrect',
 *   { attempts: 3 }
 * );
 * ```
 */
export function createAuthError(code: AuthErrorCode, message: string, details?: Record<string, unknown>): AuthError {
	return {
		code,
		message,
		...(details && { details }),
	};
}

/**
 * User-friendly error messages for each error code
 *
 * These messages are safe to display to end users and provide
 * actionable guidance.
 */
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
	INVALID_CREDENTIALS: "The email or password you entered is incorrect",
	USER_NOT_FOUND: "No account found with this email address",
	EMAIL_NOT_VERIFIED: "Please verify your email address before signing in",
	SESSION_EXPIRED: "Your session has expired. Please sign in again",
	UNAUTHORIZED: "You do not have permission to perform this action",
	RATE_LIMITED: "Too many attempts. Please try again later",
	INVALID_TOKEN: "Invalid or expired verification token",
	USER_ALREADY_EXISTS: "An account with this email already exists",
	WEAK_PASSWORD: "Password does not meet security requirements",
	INVALID_EMAIL: "Please enter a valid email address",
	OAUTH_ERROR: "Authentication with this provider failed. Please try again",
	NETWORK_ERROR: "Network error. Please check your connection and try again",
	UNKNOWN_ERROR: "An unexpected error occurred. Please try again",
};

/**
 * Get user-friendly message for an error code
 *
 * @param code - Error code
 * @returns User-friendly error message
 */
export function getErrorMessage(code: AuthErrorCode): string {
	return AUTH_ERROR_MESSAGES[code];
}
