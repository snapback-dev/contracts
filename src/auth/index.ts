/**
 * Authentication Contracts
 *
 * Centralized exports for all authentication-related types and schemas.
 * This barrel file provides a clean import interface for consuming packages.
 *
 * @example
 * ```typescript
 * // Import types from the contracts package
 * import { AuthUser, SignInRequest, AuthErrorCode } from '@snapback/contracts/auth';
 *
 * // Use schemas for validation
 * import { SignInRequestSchema } from '@snapback/contracts/auth';
 * const validatedData = SignInRequestSchema.parse(formData);
 * ```
 */

// API contracts
export {
	type ChangePasswordRequest,
	ChangePasswordRequestSchema,
	type ChangePasswordResponse,
	ChangePasswordResponseSchema,
	EmailSchema,
	type GetSessionResponse,
	GetSessionResponseSchema,
	type OAuthSignInRequest,
	OAuthSignInRequestSchema,
	PasswordSchema,
	type SignInRequest,
	SignInRequestSchema,
	type SignInResponse,
	SignInResponseSchema,
	type SignOutResponse,
	SignOutResponseSchema,
	type SignUpRequest,
	SignUpRequestSchema,
	type SignUpResponse,
	SignUpResponseSchema,
	type UpdateProfileRequest,
	UpdateProfileRequestSchema,
	type UpdateProfileResponse,
	UpdateProfileResponseSchema,
} from "./api.js";

// Error types
export {
	AUTH_ERROR_MESSAGES,
	type AuthError,
	type AuthErrorCode,
	AuthErrorCodeSchema,
	AuthErrorSchema,
	BETTER_AUTH_ERROR_MAP,
	createAuthError,
	getErrorMessage,
	mapBetterAuthError,
} from "./errors.js";
// Session types
export {
	type AuthState,
	AuthStateSchema,
	type AuthUser,
	AuthUserSchema,
	isAuthenticated,
	isLoading,
	isUnauthenticated,
	type Session,
	SessionSchema,
	type SessionWithUser,
	SessionWithUserSchema,
} from "./session.js";
