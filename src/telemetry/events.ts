/**
 * Telemetry Events Schema
 *
 * This file defines the schema for all telemetry events with strict typing
 * to ensure compile-time validation and runtime schema checking.
 */

// Base event interface
export interface TelemetryEvent {
	event: string;
	properties?: Record<string, unknown>;
	timestamp: number;
}

// Specific event types with strict property definitions
export interface ExtensionActivatedEvent {
	event: "extension.activated";
	properties: {
		version: string;
		vscodeVersion: string;
	};
	timestamp: number;
}

export interface ExtensionDeactivatedEvent {
	event: "extension.deactivated";
	properties: Record<string, never>; // No properties
	timestamp: number;
}

export interface CommandExecutionEvent {
	event: "command.execution";
	properties: {
		command: string;
		duration: number;
		success: boolean;
	};
	timestamp: number;
}

export interface SnapshotCreatedEvent {
	event: "snapshot.created";
	properties: {
		method: string;
		filesCount: number;
	};
	timestamp: number;
}

export interface SnapBackUsedEvent {
	event: "snapback.used";
	properties: {
		filesRestored: number;
		duration: number;
		success: boolean;
	};
	timestamp: number;
}

export interface RiskDetectedEvent {
	event: "risk.detected";
	properties: {
		riskLevel: string;
		patterns: string[];
		confidence: number;
	};
	timestamp: number;
}

export interface ViewActivatedEvent {
	event: "view.activated";
	properties: {
		viewId: string;
	};
	timestamp: number;
}

export interface NotificationShownEvent {
	event: "notification.shown";
	properties: {
		notificationType: string;
		actionTaken: string | null;
	};
	timestamp: number;
}

export interface FeatureUsedEvent {
	event: "feature.used";
	properties: {
		feature: string;
	};
	timestamp: number;
}

export interface ErrorEvent {
	event: "error";
	properties: {
		errorType: string;
		errorMessage: string;
	};
	timestamp: number;
}

export interface WalkthroughStepCompletedEvent {
	event: "walkthrough.step.completed";
	properties: {
		stepId: string;
		stepTitle: string;
	};
	timestamp: number;
}

export interface OnboardingProtectionAssignedEvent {
	event: "onboarding.protection.assigned";
	properties: {
		level: string;
		trigger: string;
		fileType: string;
		isFirstProtection: boolean;
	};
	timestamp: number;
}

export interface OnboardingPhaseProgressedEvent {
	event: "onboarding.phase.progressed";
	properties: {
		phase: number;
		trigger: string;
		unlockedFeatures: string[];
	};
	timestamp: number;
}

export interface OnboardingContextualPromptShownEvent {
	event: "onboarding.contextual.prompt.shown";
	properties: {
		promptType: string;
		actionTaken: string | null;
	};
	timestamp: number;
}

export interface SignatureVerificationSuccessEvent {
	event: "signature.verification.success";
	properties: Record<string, never>; // No properties
	timestamp: number;
}

export interface SignatureVerificationFailedEvent {
	event: "signature.verification.failed";
	properties: Record<string, never>; // No properties
	timestamp: number;
}

export interface RulesCachedFallbackEvent {
	event: "rules.cached.fallback";
	properties: Record<string, never>; // No properties
	timestamp: number;
}

// Union type of all allowed events
export type AllowedTelemetryEvent =
	| ExtensionActivatedEvent
	| ExtensionDeactivatedEvent
	| CommandExecutionEvent
	| SnapshotCreatedEvent
	| SnapBackUsedEvent
	| RiskDetectedEvent
	| ViewActivatedEvent
	| NotificationShownEvent
	| FeatureUsedEvent
	| ErrorEvent
	| WalkthroughStepCompletedEvent
	| OnboardingProtectionAssignedEvent
	| OnboardingPhaseProgressedEvent
	| OnboardingContextualPromptShownEvent
	| SignatureVerificationSuccessEvent
	| SignatureVerificationFailedEvent
	| RulesCachedFallbackEvent;

// Event name enum for compile-time checking
export const TELEMETRY_EVENTS = {
	EXTENSION_ACTIVATED: "extension.activated",
	EXTENSION_DEACTIVATED: "extension.deactivated",
	COMMAND_EXECUTION: "command.execution",
	SNAPSHOT_CREATED: "snapshot.created",
	SNAPBACK_USED: "snapback.used",
	RISK_DETECTED: "risk.detected",
	VIEW_ACTIVATED: "view.activated",
	NOTIFICATION_SHOWN: "notification.shown",
	FEATURE_USED: "feature.used",
	ERROR: "error",
	WALKTHROUGH_STEP_COMPLETED: "walkthrough.step.completed",
	ONBOARDING_PROTECTION_ASSIGNED: "onboarding.protection.assigned",
	ONBOARDING_PHASE_PROGRESSED: "onboarding.phase.progressed",
	ONBOARDING_CONTEXTUAL_PROMPT_SHOWN: "onboarding.contextual.prompt.shown",
	SIGNATURE_VERIFICATION_SUCCESS: "signature.verification.success",
	SIGNATURE_VERIFICATION_FAILED: "signature.verification.failed",
	RULES_CACHED_FALLBACK: "rules.cached.fallback",
} as const;

// Type for the event names
export type TelemetryEventName = (typeof TELEMETRY_EVENTS)[keyof typeof TELEMETRY_EVENTS];

// Schema validation functions
export function validateTelemetryEvent(event: TelemetryEvent): event is AllowedTelemetryEvent {
	switch (event.event) {
		case TELEMETRY_EVENTS.EXTENSION_ACTIVATED:
			return validateExtensionActivatedEvent(event as ExtensionActivatedEvent);
		case TELEMETRY_EVENTS.EXTENSION_DEACTIVATED:
			return validateExtensionDeactivatedEvent(event as ExtensionDeactivatedEvent);
		case TELEMETRY_EVENTS.COMMAND_EXECUTION:
			return validateCommandExecutionEvent(event as CommandExecutionEvent);
		case TELEMETRY_EVENTS.SNAPSHOT_CREATED:
			return validateSnapshotCreatedEvent(event as SnapshotCreatedEvent);
		case TELEMETRY_EVENTS.SNAPBACK_USED:
			return validateSnapBackUsedEvent(event as SnapBackUsedEvent);
		case TELEMETRY_EVENTS.RISK_DETECTED:
			return validateRiskDetectedEvent(event as RiskDetectedEvent);
		case TELEMETRY_EVENTS.VIEW_ACTIVATED:
			return validateViewActivatedEvent(event as ViewActivatedEvent);
		case TELEMETRY_EVENTS.NOTIFICATION_SHOWN:
			return validateNotificationShownEvent(event as NotificationShownEvent);
		case TELEMETRY_EVENTS.FEATURE_USED:
			return validateFeatureUsedEvent(event as FeatureUsedEvent);
		case TELEMETRY_EVENTS.ERROR:
			return validateErrorEvent(event as ErrorEvent);
		case TELEMETRY_EVENTS.WALKTHROUGH_STEP_COMPLETED:
			return validateWalkthroughStepCompletedEvent(event as WalkthroughStepCompletedEvent);
		case TELEMETRY_EVENTS.ONBOARDING_PROTECTION_ASSIGNED:
			return validateOnboardingProtectionAssignedEvent(event as OnboardingProtectionAssignedEvent);
		case TELEMETRY_EVENTS.ONBOARDING_PHASE_PROGRESSED:
			return validateOnboardingPhaseProgressedEvent(event as OnboardingPhaseProgressedEvent);
		case TELEMETRY_EVENTS.ONBOARDING_CONTEXTUAL_PROMPT_SHOWN:
			return validateOnboardingContextualPromptShownEvent(event as OnboardingContextualPromptShownEvent);
		case TELEMETRY_EVENTS.SIGNATURE_VERIFICATION_SUCCESS:
			return validateSignatureVerificationSuccessEvent(event as SignatureVerificationSuccessEvent);
		case TELEMETRY_EVENTS.SIGNATURE_VERIFICATION_FAILED:
			return validateSignatureVerificationFailedEvent(event as SignatureVerificationFailedEvent);
		case TELEMETRY_EVENTS.RULES_CACHED_FALLBACK:
			return validateRulesCachedFallbackEvent(event as RulesCachedFallbackEvent);
		default:
			return false;
	}
}

// Individual validation functions
function validateExtensionActivatedEvent(event: ExtensionActivatedEvent): boolean {
	return typeof event.properties.version === "string" && typeof event.properties.vscodeVersion === "string";
}

function validateExtensionDeactivatedEvent(event: ExtensionDeactivatedEvent): boolean {
	return Object.keys(event.properties).length === 0;
}

function validateCommandExecutionEvent(event: CommandExecutionEvent): boolean {
	return (
		typeof event.properties.command === "string" &&
		typeof event.properties.duration === "number" &&
		typeof event.properties.success === "boolean"
	);
}

function validateSnapshotCreatedEvent(event: SnapshotCreatedEvent): boolean {
	return typeof event.properties.method === "string" && typeof event.properties.filesCount === "number";
}

function validateSnapBackUsedEvent(event: SnapBackUsedEvent): boolean {
	return (
		typeof event.properties.filesRestored === "number" &&
		typeof event.properties.duration === "number" &&
		typeof event.properties.success === "boolean"
	);
}

function validateRiskDetectedEvent(event: RiskDetectedEvent): boolean {
	return (
		typeof event.properties.riskLevel === "string" &&
		Array.isArray(event.properties.patterns) &&
		typeof event.properties.confidence === "number"
	);
}

function validateViewActivatedEvent(event: ViewActivatedEvent): boolean {
	return typeof event.properties.viewId === "string";
}

function validateNotificationShownEvent(event: NotificationShownEvent): boolean {
	return (
		typeof event.properties.notificationType === "string" &&
		(event.properties.actionTaken === null || typeof event.properties.actionTaken === "string")
	);
}

function validateFeatureUsedEvent(event: FeatureUsedEvent): boolean {
	return typeof event.properties.feature === "string";
}

function validateErrorEvent(event: ErrorEvent): boolean {
	return typeof event.properties.errorType === "string" && typeof event.properties.errorMessage === "string";
}

function validateWalkthroughStepCompletedEvent(event: WalkthroughStepCompletedEvent): boolean {
	return typeof event.properties.stepId === "string" && typeof event.properties.stepTitle === "string";
}

function validateOnboardingProtectionAssignedEvent(event: OnboardingProtectionAssignedEvent): boolean {
	return (
		typeof event.properties.level === "string" &&
		typeof event.properties.trigger === "string" &&
		typeof event.properties.fileType === "string" &&
		typeof event.properties.isFirstProtection === "boolean"
	);
}

function validateOnboardingPhaseProgressedEvent(event: OnboardingPhaseProgressedEvent): boolean {
	return (
		typeof event.properties.phase === "number" &&
		typeof event.properties.trigger === "string" &&
		Array.isArray(event.properties.unlockedFeatures)
	);
}

function validateOnboardingContextualPromptShownEvent(event: OnboardingContextualPromptShownEvent): boolean {
	return (
		typeof event.properties.promptType === "string" &&
		(event.properties.actionTaken === null || typeof event.properties.actionTaken === "string")
	);
}

function validateSignatureVerificationSuccessEvent(event: SignatureVerificationSuccessEvent): boolean {
	return Object.keys(event.properties).length === 0;
}

function validateSignatureVerificationFailedEvent(event: SignatureVerificationFailedEvent): boolean {
	return Object.keys(event.properties).length === 0;
}

function validateRulesCachedFallbackEvent(event: RulesCachedFallbackEvent): boolean {
	return Object.keys(event.properties).length === 0;
}
