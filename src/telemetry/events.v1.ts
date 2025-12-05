import { z } from "zod";

// Event version constant
export const EVENT_VERSION = "1.0.0";

// Base event schema with version
export const BaseEventSchema = z.object({
	event_version: z.string().default(EVENT_VERSION),
	timestamp: z.number().default(() => Date.now()),
});

// 1. save_attempt event
export const SaveAttemptSchema = BaseEventSchema.extend({
	event: z.literal("save_attempt"),
	properties: z.object({
		protection: z.enum(["watch", "warn", "block"]),
		severity: z.enum(["low", "medium", "high", "critical"]),
		file_kind: z.string(),
		reason: z.string(),
		ai_present: z.boolean(),
		ai_burst: z.boolean(),
		outcome: z.enum(["saved", "canceled", "blocked"]),
	}),
});
export type SaveAttemptEventV1 = z.infer<typeof SaveAttemptSchema>;

// 2. snapshot_created event
export const SnapshotCreatedSchemaV1 = BaseEventSchema.extend({
	event: z.literal("snapshot_created"),
	properties: z.object({
		session_id: z.string(),
		snapshot_id: z.string(),
		bytes_original: z.number(),
		bytes_stored: z.number(),
		dedup_hit: z.boolean(),
		latency_ms: z.number(),
	}),
});
export type SnapshotCreatedEventV1 = z.infer<typeof SnapshotCreatedSchemaV1>;

// 3. session_finalized event
export const SessionFinalizedSchema = BaseEventSchema.extend({
	event: z.literal("session_finalized"),
	properties: z.object({
		session_id: z.string(),
		files: z.array(z.string()),
		triggers: z.array(z.string()),
		duration_ms: z.number(),
		ai_present: z.boolean(),
		ai_burst: z.boolean(),
		highest_severity: z.enum(["low", "medium", "high", "critical"]),
	}),
});
export type SessionFinalizedEventV1 = z.infer<typeof SessionFinalizedSchema>;

// 4. issue_created event
export const IssueCreatedSchema = BaseEventSchema.extend({
	event: z.literal("issue_created"),
	properties: z.object({
		issue_id: z.string(),
		session_id: z.string(),
		file_kind: z.string(),
		type: z.enum(["secret", "mock", "phantom"]),
		severity: z.enum(["low", "medium", "high", "critical"]),
		recommendation: z.string(),
	}),
});
export type IssueCreatedEventV1 = z.infer<typeof IssueCreatedSchema>;

// 5. issue_resolved event
export const IssueResolvedSchema = BaseEventSchema.extend({
	event: z.literal("issue_resolved"),
	properties: z.object({
		issue_id: z.string(),
		resolution: z.enum(["fixed", "ignored", "allowlisted"]),
	}),
});
export type IssueResolvedEventV1 = z.infer<typeof IssueResolvedSchema>;

// 6. session_restored event
export const SessionRestoredSchema = BaseEventSchema.extend({
	event: z.literal("session_restored"),
	properties: z.object({
		session_id: z.string(),
		files_restored: z.array(z.string()),
		time_to_restore_ms: z.number(),
		reason: z.string(),
	}),
});
export type SessionRestoredEventV1 = z.infer<typeof SessionRestoredSchema>;

// 7. policy_changed event
export const PolicyChangedSchema = BaseEventSchema.extend({
	event: z.literal("policy_changed"),
	properties: z.object({
		pattern: z.string(),
		from: z.enum(["watch", "warn", "block", "unprotected"]),
		to: z.enum(["watch", "warn", "block", "unprotected"]),
		source: z.string(),
	}),
});
export type PolicyChangedEventV1 = z.infer<typeof PolicyChangedSchema>;

// Union type of all core events
export type CoreTelemetryEventV1 =
	| SaveAttemptEventV1
	| SnapshotCreatedEventV1
	| SessionFinalizedEventV1
	| IssueCreatedEventV1
	| IssueResolvedEventV1
	| SessionRestoredEventV1
	| PolicyChangedEventV1;

// Zod schema for validating any core event
export const CoreEventSchema = z.discriminatedUnion("event", [
	SaveAttemptSchema,
	SnapshotCreatedSchemaV1,
	SessionFinalizedSchema,
	IssueCreatedSchema,
	IssueResolvedSchema,
	SessionRestoredSchema,
	PolicyChangedSchema,
]);

// Event name enum for compile-time checking
export const CORE_TELEMETRY_EVENTS = {
	SAVE_ATTEMPT: "save_attempt",
	SNAPSHOT_CREATED: "snapshot_created",
	SESSION_FINALIZED: "session_finalized",
	ISSUE_CREATED: "issue_created",
	ISSUE_RESOLVED: "issue_resolved",
	SESSION_RESTORED: "session_restored",
	POLICY_CHANGED: "policy_changed",
} as const;

export type CoreTelemetryEventName = (typeof CORE_TELEMETRY_EVENTS)[keyof typeof CORE_TELEMETRY_EVENTS];

// Helper function to validate core telemetry events
export function validateCoreTelemetryEvent(event: unknown): event is CoreTelemetryEventV1 {
	const result = CoreEventSchema.safeParse(event);
	return result.success;
}

// Helper function to get validation errors
export function getCoreEventValidationError(event: unknown): string | null {
	const result = CoreEventSchema.safeParse(event);
	if (result.success) {
		return null;
	}
	return result.error.message;
}
