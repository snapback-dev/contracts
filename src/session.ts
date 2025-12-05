import { z } from "zod";

/**
 * Session Layer Contracts
 *
 * Sessions are metadata overlays on the snapshot infrastructure that provide:
 * - Contextual grouping of file changes during logical work periods
 * - Selective rollback capabilities for session-scoped changes
 * - Privacy-safe analytics without exposing file contents
 *
 * Design Principles:
 * - Sessions reference Content-Addressable Storage (CAS) blobs via SHA-256 hashes
 * - No duplicate storage - all file content lives in CAS
 * - POSIX path normalization for cross-platform compatibility
 * - Lazy hash computation for <50ms tracking performance
 */

/**
 * Session schema version for backward compatibility
 */
export const SessionSchemaVersion = "sb.session.v1" as const;
export type SessionSchema = typeof SessionSchemaVersion;

/**
 * File change operation types
 */
export const ChangeOpSchema = z.enum(["created", "modified", "deleted", "renamed"]);
export type ChangeOp = z.infer<typeof ChangeOpSchema>;

/**
 * Line ending types for cross-platform consistency
 */
export const EOLTypeSchema = z.enum(["lf", "crlf"]);
export type EOLType = z.infer<typeof EOLTypeSchema>;

/**
 * Session trigger sources for analytics
 */
export const SessionTriggerSchema = z.enum(["filewatch", "pre-commit", "manual", "idle-finalize"]);
export type SessionTrigger = z.infer<typeof SessionTriggerSchema>;

/**
 * Individual file change within a session
 *
 * Captures metadata and CAS references for efficient storage.
 * Hashes (hOld/hNew) are computed lazily during session finalization.
 *
 * Path normalization:
 * - Always relative to workspace root
 * - Always POSIX-style (forward slashes) even on Windows
 * - Example: "src/auth/login.ts" (not "src\\auth\\login.ts")
 */
export const SessionChangeSchema = z.object({
	/** Relative POSIX path from workspace root */
	p: z.string(),

	/** Operation type */
	op: ChangeOpSchema,

	/** Prior relative path (for rename operations only) */
	from: z.string().optional(),

	/** SHA-256 hash before change (CAS reference) - computed on finalize */
	hOld: z.string().optional(),

	/** SHA-256 hash after change (CAS reference) - computed on finalize */
	hNew: z.string().optional(),

	/** File size before change (bytes) */
	sizeBefore: z.number().int().nonnegative().optional(),

	/** File size after change (bytes) */
	sizeAfter: z.number().int().nonnegative().optional(),

	/** Modification time before change (Unix epoch ms) */
	mtimeBefore: z.number().int().nonnegative().optional(),

	/** Modification time after change (Unix epoch ms) */
	mtimeAfter: z.number().int().nonnegative().optional(),

	/** File permissions before change (Unix mode) */
	modeBefore: z.number().int().nonnegative().optional(),

	/** File permissions after change (Unix mode) */
	modeAfter: z.number().int().nonnegative().optional(),

	/** Line ending style before change */
	eolBefore: EOLTypeSchema.optional(),

	/** Line ending style after change */
	eolAfter: EOLTypeSchema.optional(),
});
export type SessionChange = z.infer<typeof SessionChangeSchema>;

/**
 * Complete session manifest with all metadata and changes
 *
 * Sessions track logical work periods and link to snapshots created during
 * that period. The `name` field is generated offline (never transmitted) and
 * used only for UI display.
 *
 * Privacy guarantees:
 * - workspaceUri is stored locally only (never transmitted)
 * - name is generated offline (never transmitted)
 * - Only changeCount and triggers are sent to analytics (no file paths)
 */
export const SessionManifestV1Schema = z.object({
	/** Schema version for backward compatibility */
	schema: z.literal(SessionSchemaVersion),

	/** Unique session identifier (CUID) */
	sessionId: z.string(),

	/** Session start timestamp (ISO 8601) */
	startedAt: z.string().datetime(),

	/** Session end timestamp (ISO 8601) - undefined if active */
	endedAt: z.string().datetime().optional(),

	/** VS Code workspace folder URI (multi-root workspace safe) */
	workspaceUri: z.string(),

	/** Offline-generated semantic label (never transmitted) */
	name: z.string().optional(),

	/** Trigger sources for this session */
	triggers: z.array(SessionTriggerSchema),

	/** Total number of file changes in this session */
	changeCount: z.number().int().nonnegative(),

	/** Chronological list of file changes */
	filesChanged: z.array(SessionChangeSchema),

	/** Array of snapshot IDs created during this session */
	snapshots: z.array(z.string()).optional(),
});
export type SessionManifestV1 = z.infer<typeof SessionManifestV1Schema>;

/**
 * Minimal session data for list views
 */
export const SessionSummarySchema = z.object({
	sessionId: z.string(),
	startedAt: z.string().datetime(),
	endedAt: z.string().datetime().optional(),
	name: z.string().optional(),
	changeCount: z.number().int().nonnegative(),
	triggers: z.array(SessionTriggerSchema),
});
export type SessionSummary = z.infer<typeof SessionSummarySchema>;

/**
 * Session filters for querying
 */
export const SessionFiltersSchema = z.object({
	/** Only return sessions for this workspace URI */
	workspaceUri: z.string().optional(),

	/** Only return active sessions (endedAt is null) */
	activeOnly: z.boolean().optional(),

	/** Only return finalized sessions (endedAt is not null) */
	finalizedOnly: z.boolean().optional(),

	/** Return sessions that started after this timestamp */
	after: z.date().optional(),

	/** Return sessions that started before this timestamp */
	before: z.date().optional(),

	/** Maximum number of results */
	limit: z.number().int().positive().optional(),

	/** Offset for pagination */
	offset: z.number().int().nonnegative().optional(),
});
export type SessionFilters = z.infer<typeof SessionFiltersSchema>;

/**
 * Session creation options
 */
export const CreateSessionOptionsSchema = z.object({
	/** VS Code workspace folder URI */
	workspaceUri: z.string(),

	/** Initial trigger sources */
	triggers: z.array(SessionTriggerSchema).default(["filewatch"]),

	/** Optional semantic name (generated offline) */
	name: z.string().optional(),
});
export type CreateSessionOptions = z.infer<typeof CreateSessionOptionsSchema>;

/**
 * Session manager configuration
 */
export const SessionManagerConfigSchema = z.object({
	/** VS Code workspace folder URI (multi-root safe) */
	workspaceUri: z.string(),

	/** Idle timeout in milliseconds (default: 15 minutes) */
	idleMs: z
		.number()
		.int()
		.positive()
		.default(15 * 60_000),

	/** Batch size for flushing changes to database (default: 50) */
	flushBatchSize: z.number().int().positive().default(50),

	/** Flush interval in milliseconds (default: 5 seconds) */
	flushIntervalMs: z.number().int().positive().default(5000),

	/** Use VS Code file system watcher (default: true) */
	useVSCodeWatcher: z.boolean().default(true),

	/** Patterns to ignore (.snapbackignore) */
	ignorePatterns: z
		.array(z.string())
		.default([
			"node_modules/**",
			".next/**",
			"dist/**",
			"build/**",
			"coverage/**",
			".git/**",
			"*.log",
			"*.tmp",
			"*.swp",
			".DS_Store",
		]),

	/** User tier (for analytics) */
	tier: z.enum(["free", "solo"]).default("free"),

	/** Analytics consent (Solo tier only) */
	consent: z.boolean().default(false),
});
export type SessionManagerConfig = z.infer<typeof SessionManagerConfigSchema>;

/**
 * Trigger bitmask encoding for database storage
 *
 * Bit 0 (1): filewatch
 * Bit 1 (2): pre-commit
 * Bit 2 (4): manual
 * Bit 3 (8): idle-finalize
 *
 * Example: bitmask = 5 → filewatch (1) + manual (4)
 */
export function encodeTriggerBitmask(triggers: SessionTrigger[]): number {
	let mask = 0;
	for (const trigger of triggers) {
		switch (trigger) {
			case "filewatch":
				mask |= 1;
				break;
			case "pre-commit":
				mask |= 2;
				break;
			case "manual":
				mask |= 4;
				break;
			case "idle-finalize":
				mask |= 8;
				break;
		}
	}
	return mask;
}

/**
 * Decode trigger bitmask to array of trigger types
 */
export function decodeTriggerBitmask(mask: number): SessionTrigger[] {
	const triggers: SessionTrigger[] = [];
	if (mask & 1) {
		triggers.push("filewatch");
	}
	if (mask & 2) {
		triggers.push("pre-commit");
	}
	if (mask & 4) {
		triggers.push("manual");
	}
	if (mask & 8) {
		triggers.push("idle-finalize");
	}
	return triggers;
}
