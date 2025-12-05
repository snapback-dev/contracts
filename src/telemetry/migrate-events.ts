#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { mapLegacyEventsToCore, TelemetryEventMapper } from "./event-mapper.js";
import type { AllowedTelemetryEvent } from "./events.js";
import type { CoreTelemetryEventV1 } from "./events.v1.js";

/**
 * Migration script to convert legacy telemetry events to core events
 *
 * Usage: node migrate-events.js <input-file> <output-file>
 *
 * This script reads a JSON file containing an array of legacy telemetry events,
 * converts them to the new core event format, and writes the results to an output file.
 */

function main() {
	// Get command line arguments
	const args = process.argv.slice(2);

	if (args.length < 2) {
		console.log("Usage: node migrate-events.js <input-file> <output-file>");
		console.log("  input-file: Path to JSON file containing legacy events array");
		console.log("  output-file: Path to write converted core events");
		process.exit(1);
	}

	const inputFile = args[0];
	const outputFile = args[1];

	try {
		// Read legacy events from input file
		const inputData = readFileSync(inputFile, "utf8");
		const legacyEvents: AllowedTelemetryEvent[] = JSON.parse(inputData);

		if (!Array.isArray(legacyEvents)) {
			throw new Error("Input file must contain an array of events");
		}

		console.log(`Read ${legacyEvents.length} legacy events from ${inputFile}`);

		// Convert events
		const coreEvents: CoreTelemetryEventV1[] = [];
		const unmappedEvents: AllowedTelemetryEvent[] = [];

		for (const legacyEvent of legacyEvents) {
			const coreEvent = TelemetryEventMapper.mapEvent(legacyEvent);
			if (coreEvent) {
				coreEvents.push(coreEvent);
			} else {
				unmappedEvents.push(legacyEvent);
			}
		}

		console.log(`Converted ${coreEvents.length} events to core format`);
		console.log(`${unmappedEvents.length} events could not be mapped (contributing to derived metrics only)`);

		// Write core events to output file
		writeFileSync(outputFile, JSON.stringify(coreEvents, null, 2));
		console.log(`Wrote ${coreEvents.length} core events to ${outputFile}`);

		// Optionally write unmapped events to a separate file
		if (unmappedEvents.length > 0) {
			const unmappedFile = outputFile.replace(".json", "-unmapped.json");
			writeFileSync(unmappedFile, JSON.stringify(unmappedEvents, null, 2));
			console.log(`Wrote ${unmappedEvents.length} unmapped events to ${unmappedFile}`);
		}

		console.log("Migration completed successfully!");
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	}
}

// Run the migration if this script is executed directly
if (require.main === module) {
	main();
}

// Export functions for programmatic use
export { migrateLegacyEventsToFile, migrateLegacyEventsToArray };

/**
 * Migrates legacy events from an input file to core events in an output file
 * @param inputFile Path to JSON file containing legacy events array
 * @param outputFile Path to write converted core events
 */
async function migrateLegacyEventsToFile(inputFile: string, outputFile: string): Promise<void> {
	const inputData = readFileSync(inputFile, "utf8");
	const legacyEvents: AllowedTelemetryEvent[] = JSON.parse(inputData);

	const coreEvents = mapLegacyEventsToCore(legacyEvents);

	writeFileSync(outputFile, JSON.stringify(coreEvents, null, 2));
}

/**
 * Migrates legacy events to core events and returns the result
 * @param legacyEvents Array of legacy events to convert
 * @returns Array of converted core events
 */
function migrateLegacyEventsToArray(legacyEvents: AllowedTelemetryEvent[]): CoreTelemetryEventV1[] {
	return mapLegacyEventsToCore(legacyEvents);
}
