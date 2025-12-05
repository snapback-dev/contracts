export const FEATURE_FLAGS = {
	// Core protection features
	"protection.enabled": true,
	"protection.auto_checkpoint": true,
	"protection.pre_save_hook": true,

	// Risk analysis
	"risk.guardian_v2": false,
	"risk.dependency_analysis": true,
	"risk.deep_analysis": false,
	"risk.ai_detection": true,

	// Storage
	"storage.compression": true,
	"storage.deduplication": false,
	"storage.encryption": false,

	// UI/UX
	"ui.chat_participant": true,
	"ui.status_bar": true,
	"ui.timeline_view": true,

	// Telemetry
	"telemetry.detailed_events": false,
	"telemetry.performance_metrics": true,
	"telemetry.sampling_rate": 1.0,

	// Experimental
	"experimental.mcp_tools": false,
	"experimental.recovery_mode": false,

	// A/B Testing - DeepScan
	"deepscan.v2_algorithm": false,
	"deepscan.enhanced_analysis": false,
	"deepscan.real_time_processing": false,

	// Event System Migration
	"events.eventemitter2": false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
