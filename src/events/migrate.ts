/**
 * Event Migration Utilities
 *
 * This file provides utilities for migrating from legacy events to core events.
 */

import {
	type CoreTelemetryEvent,
	IssueCreatedSchema,
	IssueResolvedSchema,
	SaveAttemptSchema,
	SessionFinalizedSchema,
	SessionRestoredSchema,
	SnapshotCreatedSchema,
	validateCoreTelemetryEvent,
} from "./core.js";
import { LEGACY_TELEMETRY_EVENTS, type LegacyAllowedTelemetryEvent } from "./index.js";

/**
 * Maps legacy telemetry events to new core events
 *
 * This utility transforms the existing 60+ events into the new 7 core events
 * for simplified analytics and reporting.
 */
export class TelemetryEventMapper {
	/**
	 * Maps a legacy telemetry event to a core event
	 * @param event The legacy event to map
	 * @returns The mapped core event or null if no mapping exists
	 */
	mapEvent(event: LegacyAllowedTelemetryEvent): CoreTelemetryEvent | null {
		switch (event.event) {
			// Map save attempt related events
			case LEGACY_TELEMETRY_EVENTS.ONBOARDING_PROTECTION_ASSIGNED:
				return this.mapOnboardingProtectionAssigned(event);

			case LEGACY_TELEMETRY_EVENTS.COMMAND_EXECUTION:
				return this.mapCommandExecution(event);

			// Map snapshot created related events
			case LEGACY_TELEMETRY_EVENTS.SNAPSHOT_CREATED:
				return this.mapSnapshotCreated(event);

			// Map session finalized related events
			case LEGACY_TELEMETRY_EVENTS.EXTENSION_DEACTIVATED:
				return this.mapExtensionDeactivated(event);

			// Map issue created related events
			case LEGACY_TELEMETRY_EVENTS.RISK_DETECTED:
				return this.mapRiskDetected(event);

			// Map issue resolved related events
			case LEGACY_TELEMETRY_EVENTS.WALKTHROUGH_STEP_COMPLETED:
				return this.mapWalkthroughStepCompleted(event);

			// Map session restored related events
			case LEGACY_TELEMETRY_EVENTS.SNAPBACK_USED:
				return this.mapSnapBackUsed(event);

			// Events that don't map directly but contribute to derived metrics
			case LEGACY_TELEMETRY_EVENTS.EXTENSION_ACTIVATED:
			case LEGACY_TELEMETRY_EVENTS.VIEW_ACTIVATED:
			case LEGACY_TELEMETRY_EVENTS.NOTIFICATION_SHOWN:
			case LEGACY_TELEMETRY_EVENTS.FEATURE_USED:
			case LEGACY_TELEMETRY_EVENTS.ERROR:
			case LEGACY_TELEMETRY_EVENTS.ONBOARDING_PHASE_PROGRESSED:
			case LEGACY_TELEMETRY_EVENTS.ONBOARDING_CONTEXTUAL_PROMPT_SHOWN:
			case LEGACY_TELEMETRY_EVENTS.SIGNATURE_VERIFICATION_SUCCESS:
			case LEGACY_TELEMETRY_EVENTS.SIGNATURE_VERIFICATION_FAILED:
			case LEGACY_TELEMETRY_EVENTS.RULES_CACHED_FALLBACK:
				// These events contribute to derived metrics but don't map to core events
				return null;

			default:
				// Unknown event type
				return null;
		}
	}

	private mapOnboardingProtectionAssigned(event: LegacyAllowedTelemetryEvent): CoreTelemetryEvent | null {
		if (event.event !== LEGACY_TELEMETRY_EVENTS.ONBOARDING_PROTECTION_ASSIGNED) {
			return null;
		}

		// Convert onboarding protection assigned to save attempt
		const saveAttemptEvent = {
			event: "save_attempt",
			properties: {
				protection: event.properties.level,
				severity: "medium", // Default severity
				file_kind: event.properties.fileType,
				reason: event.properties.trigger,
				ai_present: false, // Default
				ai_burst: false, // Default
				outcome: "saved", // Default outcome
			},
			timestamp: event.timestamp,
		};

		// Validate the mapped event
		if (validateCoreTelemetryEvent(saveAttemptEvent)) {
			return SaveAttemptSchema.parse(saveAttemptEvent);
		}

		return null;
	}

	private mapCommandExecution(event: LegacyAllowedTelemetryEvent): CoreTelemetryEvent | null {
		if (event.event !== LEGACY_TELEMETRY_EVENTS.COMMAND_EXECUTION) {
			return null;
		}

		// Convert command execution to save attempt
		const saveAttemptEvent = {
			event: "save_attempt",
			properties: {
				protection: "watch", // Default protection
				severity: "low", // Default severity
				file_kind: "unknown", // Default file kind
				reason: event.properties.command,
				ai_present: false, // Default
				ai_burst: false, // Default
				outcome: event.properties.success ? "saved" : "canceled",
			},
			timestamp: event.timestamp,
		};

		// Validate the mapped event
		if (validateCoreTelemetryEvent(saveAttemptEvent)) {
			return SaveAttemptSchema.parse(saveAttemptEvent);
		}

		return null;
	}

	private mapSnapshotCreated(event: LegacyAllowedTelemetryEvent): CoreTelemetryEvent | null {
		if (event.event !== LEGACY_TELEMETRY_EVENTS.SNAPSHOT_CREATED) {
			return null;
		}

		// Convert snapshot created event
		const snapshotCreatedEvent = {
			event: "snapshot_created",
			properties: {
				session_id: "unknown", // We don't have session info in legacy events
				snapshot_id: "unknown", // We don't have snapshot ID in legacy events
				bytes_original: 0, // Default
				bytes_stored: 0, // Default
				dedup_hit: false, // Default
				latency_ms: this.getDurationFromEvent(event),
			},
			timestamp: event.timestamp,
		};

		// Validate the mapped event
		if (validateCoreTelemetryEvent(snapshotCreatedEvent)) {
			return SnapshotCreatedSchema.parse(snapshotCreatedEvent);
		}

		return null;
	}

	private mapExtensionDeactivated(event: LegacyAllowedTelemetryEvent): CoreTelemetryEvent | null {
		if (event.event !== LEGACY_TELEMETRY_EVENTS.EXTENSION_DEACTIVATED) {
			return null;
		}

		// Convert extension deactivation to session finalized
		const sessionFinalizedEvent = {
			event: "session_finalized",
			properties: {
				session_id: "unknown", // We don't have session info in legacy events
				files: [], // Default
				triggers: [], // Default
				duration_ms: this.getDurationFromEvent(event),
				ai_present: false, // Default
				ai_burst: false, // Default
				highest_severity: "low", // Default
			},
			timestamp: event.timestamp,
		};

		// Validate the mapped event
		if (validateCoreTelemetryEvent(sessionFinalizedEvent)) {
			return SessionFinalizedSchema.parse(sessionFinalizedEvent);
		}

		return null;
	}

	private mapRiskDetected(event: LegacyAllowedTelemetryEvent): CoreTelemetryEvent | null {
		if (event.event !== LEGACY_TELEMETRY_EVENTS.RISK_DETECTED) {
			return null;
		}

		// Convert risk detected to issue created
		const issueCreatedEvent = {
			event: "issue_created",
			properties: {
				issue_id: "unknown", // We don't have issue ID in legacy events
				session_id: "unknown", // We don't have session info in legacy events
				file_kind: "unknown", // Default
				type: "phantom", // Default type
				severity: event.properties.riskLevel as any, // Map risk level to severity
				recommendation: "Review detected risk", // Default recommendation
			},
			timestamp: event.timestamp,
		};

		// Validate the mapped event
		if (validateCoreTelemetryEvent(issueCreatedEvent)) {
			return IssueCreatedSchema.parse(issueCreatedEvent);
		}

		return null;
	}

	private mapWalkthroughStepCompleted(event: LegacyAllowedTelemetryEvent): CoreTelemetryEvent | null {
		if (event.event !== LEGACY_TELEMETRY_EVENTS.WALKTHROUGH_STEP_COMPLETED) {
			return null;
		}

		// Convert walkthrough step completed to issue resolved
		const issueResolvedEvent = {
			event: "issue_resolved",
			properties: {
				issue_id: `onboarding-${event.properties.stepId}`, // Create a pseudo issue ID
				resolution: "fixed", // Default resolution
			},
			timestamp: event.timestamp,
		};

		// Validate the mapped event
		if (validateCoreTelemetryEvent(issueResolvedEvent)) {
			return IssueResolvedSchema.parse(issueResolvedEvent);
		}

		return null;
	}

	private mapSnapBackUsed(event: LegacyAllowedTelemetryEvent): CoreTelemetryEvent | null {
		if (event.event !== LEGACY_TELEMETRY_EVENTS.SNAPBACK_USED) {
			return null;
		}

		// Convert snapback used to session restored
		const sessionRestoredEvent = {
			event: "session_restored",
			properties: {
				session_id: "unknown", // We don't have session info in legacy events
				files_restored: [], // Default
				time_to_restore_ms: this.getDurationFromEvent(event),
				reason: "user_request", // Default reason
			},
			timestamp: event.timestamp,
		};

		// Validate the mapped event
		if (validateCoreTelemetryEvent(sessionRestoredEvent)) {
			return SessionRestoredSchema.parse(sessionRestoredEvent);
		}

		return null;
	}

	/**
	 * Helper method to safely extract duration from various event types
	 */
	private getDurationFromEvent(event: LegacyAllowedTelemetryEvent): number {
		// Check if the event has a duration property
		if ("properties" in event && event.properties && typeof event.properties === "object") {
			// For CommandExecutionEvent
			if (event.event === LEGACY_TELEMETRY_EVENTS.COMMAND_EXECUTION && "duration" in event.properties) {
				return typeof event.properties.duration === "number" ? event.properties.duration : 0;
			}

			// For SnapBackUsedEvent
			if (event.event === LEGACY_TELEMETRY_EVENTS.SNAPBACK_USED && "duration" in event.properties) {
				return typeof event.properties.duration === "number" ? event.properties.duration : 0;
			}
		}

		// Default to 0 if no duration property found
		return 0;
	}
}

// Export a singleton instance for convenience
export const telemetryEventMapper = new TelemetryEventMapper();
