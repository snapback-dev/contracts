#!/usr/bin/env node

/**
 * Type Generation Script
 *
 * This script generates TypeScript types from Zod schemas and other contract definitions.
 */

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Since we're running this as a compiled JS file, we need to adjust the import paths
// Import our schemas from the compiled output
import { CORE_TELEMETRY_EVENTS } from "../events/core.js";

// Import infrastructure events
import { AnalyticsEvents } from "../events/infrastructure.js";

async function generateCoreEventTypes() {
	const outputPath = join(__dirname, "../../generated/core-events.ts");

	let content = `/**
 * Generated Core Event Types
 * 
 * This file is auto-generated from Zod schemas. Do not edit manually.
 */

`;

	// Generate types for each core event
	content += "// Save Attempt Event\n";
	content += "export type SaveAttemptEvent = {\n";
	content += `  event: "${CORE_TELEMETRY_EVENTS.SAVE_ATTEMPT}";\n`;
	content += "  event_version?: string;\n";
	content += "  timestamp: number;\n";
	content += "  properties: {\n";
	content += `    protection: "watch" | "warn" | "block";\n`;
	content += `    severity: "low" | "medium" | "high" | "critical";\n`;
	content += "    file_kind: string;\n";
	content += "    reason: string;\n";
	content += "    ai_present: boolean;\n";
	content += "    ai_burst: boolean;\n";
	content += `    outcome: "saved" | "canceled" | "blocked";\n`;
	content += "  };\n";
	content += "};\n\n";

	content += "// Snapshot Created Event\n";
	content += "export type SnapshotCreatedEvent = {\n";
	content += `  event: "${CORE_TELEMETRY_EVENTS.SNAPSHOT_CREATED}";\n`;
	content += "  event_version?: string;\n";
	content += "  timestamp: number;\n";
	content += "  properties: {\n";
	content += "    session_id: string;\n";
	content += "    snapshot_id: string;\n";
	content += "    bytes_original: number;\n";
	content += "    bytes_stored: number;\n";
	content += "    dedup_hit: boolean;\n";
	content += "    latency_ms: number;\n";
	content += "  };\n";
	content += "};\n\n";

	content += "// Session Finalized Event\n";
	content += "export type SessionFinalizedEvent = {\n";
	content += `  event: "${CORE_TELEMETRY_EVENTS.SESSION_FINALIZED}";\n`;
	content += "  event_version?: string;\n";
	content += "  timestamp: number;\n";
	content += "  properties: {\n";
	content += "    session_id: string;\n";
	content += "    files: string[];\n";
	content += "    triggers: string[];\n";
	content += "    duration_ms: number;\n";
	content += "    ai_present: boolean;\n";
	content += "    ai_burst: boolean;\n";
	content += `    highest_severity: "low" | "medium" | "high" | "critical";\n`;
	content += "  };\n";
	content += "};\n\n";

	content += "// Issue Created Event\n";
	content += "export type IssueCreatedEvent = {\n";
	content += `  event: "${CORE_TELEMETRY_EVENTS.ISSUE_CREATED}";\n`;
	content += "  event_version?: string;\n";
	content += "  timestamp: number;\n";
	content += "  properties: {\n";
	content += "    issue_id: string;\n";
	content += "    session_id: string;\n";
	content += "    file_kind: string;\n";
	content += `    type: "secret" | "mock" | "phantom";\n`;
	content += `    severity: "low" | "medium" | "high" | "critical";\n`;
	content += "    recommendation: string;\n";
	content += "  };\n";
	content += "};\n\n";

	content += "// Issue Resolved Event\n";
	content += "export type IssueResolvedEvent = {\n";
	content += `  event: "${CORE_TELEMETRY_EVENTS.ISSUE_RESOLVED}";\n`;
	content += "  event_version?: string;\n";
	content += "  timestamp: number;\n";
	content += "  properties: {\n";
	content += "    issue_id: string;\n";
	content += `    resolution: "fixed" | "ignored" | "allowlisted";\n`;
	content += "  };\n";
	content += "};\n\n";

	content += "// Session Restored Event\n";
	content += "export type SessionRestoredEvent = {\n";
	content += `  event: "${CORE_TELEMETRY_EVENTS.SESSION_RESTORED}";\n`;
	content += "  event_version?: string;\n";
	content += "  timestamp: number;\n";
	content += "  properties: {\n";
	content += "    session_id: string;\n";
	content += "    files_restored: string[];\n";
	content += "    time_to_restore_ms: number;\n";
	content += "    reason: string;\n";
	content += "  };\n";
	content += "};\n\n";

	content += "// Policy Changed Event\n";
	content += "export type PolicyChangedEvent = {\n";
	content += `  event: "${CORE_TELEMETRY_EVENTS.POLICY_CHANGED}";\n`;
	content += "  event_version?: string;\n";
	content += "  timestamp: number;\n";
	content += "  properties: {\n";
	content += "    pattern: string;\n";
	content += `    from: "watch" | "warn" | "block" | "unprotected";\n`;
	content += `    to: "watch" | "warn" | "block" | "unprotected";\n`;
	content += "    source: string;\n";
	content += "  };\n";
	content += "};\n\n";

	content += "// Union type of all core events\n";
	content += "export type CoreTelemetryEvent =\n";
	content += "  | SaveAttemptEvent\n";
	content += "  | SnapshotCreatedEvent\n";
	content += "  | SessionFinalizedEvent\n";
	content += "  | IssueCreatedEvent\n";
	content += "  | IssueResolvedEvent\n";
	content += "  | SessionRestoredEvent\n";
	content += "  | PolicyChangedEvent;\n\n";

	// Write the file
	await writeFile(outputPath, content);
	console.log(`Generated core event types at ${outputPath}`);
}

async function generateInfrastructureEventTypes() {
	const outputPath = join(__dirname, "../../generated/infrastructure-events.ts");

	let content = `/**
 * Generated Infrastructure Event Types
 * 
 * This file is auto-generated from event definitions. Do not edit manually.
 */

`;

	// Generate types for infrastructure events
	content += "// Analytics Events Enum\n";
	content += "export const AnalyticsEvents = {\n";
	for (const [key, value] of Object.entries(AnalyticsEvents)) {
		content += `  ${key}: "${value}",\n`;
	}
	content += "} as const;\n\n";

	content += "export type AnalyticsEvent = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];\n\n";

	// Write the file
	await writeFile(outputPath, content);
	console.log(`Generated infrastructure event types at ${outputPath}`);
}

async function generateAll() {
	// Create generated directory if it doesn't exist
	const generatedDir = join(__dirname, "../../generated");
	try {
		// Try to create the directory first
		const { mkdir } = await import("node:fs/promises");
		await mkdir(generatedDir, { recursive: true });
	} catch (_error) {
		// Directory might already exist, which is fine
	}

	await generateCoreEventTypes();
	await generateInfrastructureEventTypes();

	console.log("All types generated successfully!");
}

// Run the generation
generateAll().catch(console.error);
