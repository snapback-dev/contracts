/**
 * Events Index - Unified Event Definitions
 *
 * This file exports all event definitions from the contracts package.
 */

// Export legacy events with type-safe re-exports
export type {
	AllowedTelemetryEvent as LegacyAllowedTelemetryEvent,
	CommandExecutionEvent as LegacyCommandExecutionEvent,
	ErrorEvent as LegacyErrorEvent,
	ExtensionActivatedEvent as LegacyExtensionActivatedEvent,
	ExtensionDeactivatedEvent as LegacyExtensionDeactivatedEvent,
	FeatureUsedEvent as LegacyFeatureUsedEvent,
	NotificationShownEvent as LegacyNotificationShownEvent,
	OnboardingContextualPromptShownEvent as LegacyOnboardingContextualPromptShownEvent,
	OnboardingPhaseProgressedEvent as LegacyOnboardingPhaseProgressedEvent,
	OnboardingProtectionAssignedEvent as LegacyOnboardingProtectionAssignedEvent,
	RiskDetectedEvent as LegacyRiskDetectedEvent,
	RulesCachedFallbackEvent as LegacyRulesCachedFallbackEvent,
	SignatureVerificationFailedEvent as LegacySignatureVerificationFailedEvent,
	SignatureVerificationSuccessEvent as LegacySignatureVerificationSuccessEvent,
	SnapBackUsedEvent as LegacySnapBackUsedEvent,
	SnapshotCreatedEvent as LegacySnapshotCreatedEvent,
	TelemetryEvent as LegacyTelemetryEvent,
	TelemetryEventName as LegacyTelemetryEventName,
	ViewActivatedEvent as LegacyViewActivatedEvent,
	WalkthroughStepCompletedEvent as LegacyWalkthroughStepCompletedEvent,
} from "../telemetry/events.js";
// Export legacy event names and validation functions
export {
	TELEMETRY_EVENTS as LEGACY_TELEMETRY_EVENTS,
	validateTelemetryEvent as validateLegacyTelemetryEvent,
} from "../telemetry/events.js";
// Export core events (new v1 schema)
export * from "./core.js";
// Export infrastructure events
export * from "./infrastructure.js";
// NOTE: Temporarily disabled due to circular dependency during build
// export * from "./migrate.js";
