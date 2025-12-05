/// <reference types="react" />

export * from "./analytics.js";
// Auth contracts (explicit exports to avoid naming conflicts)
export {
	AUTH_ERROR_MESSAGES,
	type AuthError,
	type AuthErrorCode,
	// Error types
	AuthErrorCodeSchema,
	AuthErrorSchema,
	type AuthState,
	AuthStateSchema,
	type AuthUser,
	// Session types
	AuthUserSchema,
	BETTER_AUTH_ERROR_MAP,
	type ChangePasswordRequest,
	ChangePasswordRequestSchema,
	type ChangePasswordResponse,
	ChangePasswordResponseSchema,
	createAuthError,
	EmailSchema,
	type GetSessionResponse,
	GetSessionResponseSchema,
	getErrorMessage,
	isAuthenticated,
	isLoading,
	isUnauthenticated,
	mapBetterAuthError,
	type OAuthSignInRequest,
	OAuthSignInRequestSchema,
	// API contracts
	PasswordSchema,
	type Session as AuthSession,
	SessionSchema as AuthSessionSchema,
	type SessionWithUser,
	SessionWithUserSchema,
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
} from "./auth/index.js";
export * from "./eventBus.js";
export * from "./events/index.js";
export * from "./exports.js";
export * from "./feature-manager.js";
export * from "./features.js";
export * from "./id-generator.js";
export * from "./logger.js";
export * from "./risk-conversion.js";
export * from "./schemas.js";
// Alpha contracts (Phase 0)
export * from "./tiers.js";
// Note: telemetry re-exports from events, so not exported here to avoid conflicts

export * from "./session.js";
export * from "./types/config.js";
export * from "./types/protection.js";
// Note: Not exporting types/snapshot due to naming conflicts with schemas.ts

// Required exports for SDK functionality
export type {
	AnalyticsResponse,
	DiffChange,
	FileMetadata,
	RiskScore,
	Snapshot,
	SnapshotMetadata,
} from "./schemas.js";

// Export snapshot types that don't conflict
export type {
	CreateSnapshotOptions,
	FileInput,
	SnapshotFilters,
	SnapshotRestoreResult,
	SnapshotStorage,
} from "./types/snapshot.js";

// Note: createSnapshotStorage is commented out to avoid SDK dependency in web builds
// CLI and VSCode extension import SDK directly, not through contracts
// Web app uses Supabase storage, not local SQLite (better-sqlite3)
// export { createSnapshotStorage } from "./types/snapshot.js"
