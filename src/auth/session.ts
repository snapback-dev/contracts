/**
 * Authentication Session Types
 *
 * Core types and schemas for user authentication and session management.
 * These contracts are shared between frontend and backend to ensure type safety.
 */

import { z } from "zod";

/**
 * Core user schema - minimal fields needed for authentication
 *
 * This represents the authenticated user object as returned by Better Auth
 * and used throughout the application.
 */
export const AuthUserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string().nullable(),
	image: z.string().url().nullable(),
	emailVerified: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

/**
 * Session schema - represents an active authentication session
 *
 * Sessions are stored in the database and include metadata about
 * the device and location for security purposes.
 */
export const SessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	expiresAt: z.coerce.date(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	// Better Auth session metadata
	userAgent: z.string().nullable().optional(),
	ipAddress: z.string().nullable().optional(),
});

export type Session = z.infer<typeof SessionSchema>;

/**
 * Combined session + user for convenience
 *
 * This is the most common data structure used in the frontend,
 * representing a fully authenticated state with both session and user data.
 *
 * @example
 * ```typescript
 * const session = await getSession();
 * if (session) {
 *   console.log(session.user.email); // Access user data
 *   console.log(session.session.expiresAt); // Access session data
 * }
 * ```
 */
export const SessionWithUserSchema = z.object({
	session: SessionSchema,
	user: AuthUserSchema,
});

export type SessionWithUser = z.infer<typeof SessionWithUserSchema>;

/**
 * Authentication state for UI components
 *
 * Discriminated union representing the three possible auth states:
 * - authenticated: User is logged in with valid session
 * - unauthenticated: No valid session exists
 * - loading: Session check in progress
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { state } = useAuth();
 *
 *   if (state.status === 'loading') {
 *     return <Spinner />;
 *   }
 *
 *   if (state.status === 'unauthenticated') {
 *     return <LoginPrompt />;
 *   }
 *
 *   // TypeScript knows state.user exists here
 *   return <div>Welcome, {state.user.name}</div>;
 * }
 * ```
 */
export const AuthStateSchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("authenticated"),
		user: AuthUserSchema,
		session: SessionSchema,
	}),
	z.object({
		status: z.literal("unauthenticated"),
	}),
	z.object({
		status: z.literal("loading"),
	}),
]);

export type AuthState = z.infer<typeof AuthStateSchema>;

/**
 * Type guards for auth state
 */
export function isAuthenticated(state: AuthState): state is Extract<AuthState, { status: "authenticated" }> {
	return state.status === "authenticated";
}

export function isUnauthenticated(state: AuthState): state is Extract<AuthState, { status: "unauthenticated" }> {
	return state.status === "unauthenticated";
}

export function isLoading(state: AuthState): state is Extract<AuthState, { status: "loading" }> {
	return state.status === "loading";
}
