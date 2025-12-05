/**
 * Authentication API Contracts
 *
 * Request and response schemas for all authentication endpoints.
 * These schemas ensure type safety and runtime validation across
 * the frontend/backend boundary.
 */

import { z } from "zod";
import { AuthErrorSchema } from "./errors.js";
import { AuthUserSchema, SessionWithUserSchema } from "./session.js";

/**
 * Password validation schema
 *
 * Enforces security requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const PasswordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[0-9]/, "Password must contain at least one number");

/**
 * Email validation schema
 *
 * Validates email format and normalizes to lowercase
 */
export const EmailSchema = z.string().email("Invalid email address").toLowerCase().trim();

/**
 * Sign up request schema
 *
 * @example
 * ```typescript
 * const signupData: SignUpRequest = {
 *   email: 'user@example.com',
 *   password: 'SecurePass123',
 *   name: 'John Doe'
 * };
 * ```
 */
export const SignUpRequestSchema = z.object({
	email: EmailSchema,
	password: PasswordSchema,
	name: z.string().min(1, "Name is required").max(100, "Name is too long").trim(),
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

/**
 * Sign up response schema
 *
 * Uses discriminated union for type-safe success/error handling
 *
 * @example
 * ```typescript
 * const response = await signUp(data);
 * if (response.success) {
 *   console.log('User created:', response.user.email);
 * } else {
 *   console.error('Signup failed:', response.error.message);
 * }
 * ```
 */
export const SignUpResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
		user: AuthUserSchema,
	}),
	z.object({
		success: z.literal(false),
		error: AuthErrorSchema,
	}),
]);

export type SignUpResponse = z.infer<typeof SignUpResponseSchema>;

/**
 * Sign in request schema
 *
 * Includes optional `rememberMe` field to control session duration:
 * - true (default): 7-day session
 * - false: 24-hour session
 *
 * @example
 * ```typescript
 * const signinData: SignInRequest = {
 *   email: 'user@example.com',
 *   password: 'SecurePass123',
 *   rememberMe: true  // Optional, defaults to false
 * };
 * ```
 */
export const SignInRequestSchema = z.object({
	email: EmailSchema,
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().optional().default(false),
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;

/**
 * Sign in response schema
 *
 * Returns user and session information on success
 *
 * @example
 * ```typescript
 * const response = await signIn(data);
 * if (response.success) {
 *   console.log('Logged in:', response.user.email);
 *   console.log('Session expires:', response.session.expiresAt);
 * } else {
 *   console.error('Login failed:', response.error.message);
 * }
 * ```
 */
export const SignInResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
		user: AuthUserSchema,
		session: z.object({
			id: z.string(),
			expiresAt: z.coerce.date(),
		}),
	}),
	z.object({
		success: z.literal(false),
		error: AuthErrorSchema,
	}),
]);

export type SignInResponse = z.infer<typeof SignInResponseSchema>;

/**
 * Get session response schema
 *
 * Returns session with user data if authenticated, null otherwise
 *
 * @example
 * ```typescript
 * const session = await getSession();
 * if (session) {
 *   console.log('Authenticated as:', session.user.email);
 * } else {
 *   console.log('Not authenticated');
 * }
 * ```
 */
export const GetSessionResponseSchema = z.union([SessionWithUserSchema, z.null()]);

export type GetSessionResponse = z.infer<typeof GetSessionResponseSchema>;

/**
 * Sign out response schema
 *
 * Simple success/error response for logout operations
 */
export const SignOutResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
	}),
	z.object({
		success: z.literal(false),
		error: AuthErrorSchema,
	}),
]);

export type SignOutResponse = z.infer<typeof SignOutResponseSchema>;

/**
 * Update user profile request schema
 *
 * All fields are optional - only provided fields will be updated
 *
 * @example
 * ```typescript
 * const updates: UpdateProfileRequest = {
 *   name: 'Jane Doe',
 *   // image not provided, won't be updated
 * };
 * ```
 */
export const UpdateProfileRequestSchema = z.object({
	name: z.string().min(1).max(100).trim().optional(),
	image: z.string().url().optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

/**
 * Update user profile response schema
 */
export const UpdateProfileResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
		user: AuthUserSchema,
	}),
	z.object({
		success: z.literal(false),
		error: AuthErrorSchema,
	}),
]);

export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

/**
 * Change password request schema
 *
 * Requires current password for security
 */
export const ChangePasswordRequestSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: PasswordSchema,
});

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

/**
 * Change password response schema
 */
export const ChangePasswordResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
	}),
	z.object({
		success: z.literal(false),
		error: AuthErrorSchema,
	}),
]);

export type ChangePasswordResponse = z.infer<typeof ChangePasswordResponseSchema>;

/**
 * OAuth sign-in request schema
 *
 * Supports GitHub, Google, and other OAuth providers
 */
export const OAuthSignInRequestSchema = z.object({
	provider: z.enum(["github", "google"]),
	callbackURL: z.string().url().optional(),
});

export type OAuthSignInRequest = z.infer<typeof OAuthSignInRequestSchema>;
