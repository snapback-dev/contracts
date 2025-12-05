#!/usr/bin/env node

/**
 * OpenAPI Schema Generation Script
 *
 * This script generates OpenAPI schemas from Zod schemas.
 */

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
	IssueCreatedSchema,
	IssueResolvedSchema,
	PolicyChangedSchema,
	SaveAttemptSchema,
	SessionFinalizedSchema,
	SessionRestoredSchema,
	SnapshotCreatedSchema,
} from "../events/core.js";

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOpenAPISpec() {
	// Create registry and register our schemas
	const registry = new OpenAPIRegistry();

	// Register each event schema with descriptive names
	const registeredSchemas = {
		SaveAttempt: registry.register("SaveAttemptEvent", SaveAttemptSchema),
		SnapshotCreated: registry.register("SnapshotCreatedEvent", SnapshotCreatedSchema),
		SessionFinalized: registry.register("SessionFinalizedEvent", SessionFinalizedSchema),
		IssueCreated: registry.register("IssueCreatedEvent", IssueCreatedSchema),
		IssueResolved: registry.register("IssueResolvedEvent", IssueResolvedSchema),
		SessionRestored: registry.register("SessionRestoredEvent", SessionRestoredSchema),
		PolicyChanged: registry.register("PolicyChangedEvent", PolicyChangedSchema),
	};

	// Register the telemetry endpoint
	registry.registerPath({
		method: "post",
		path: "/telemetry",
		summary: "Send telemetry event",
		description: "Endpoint for sending telemetry events to the SnapBack system",
		request: {
			body: {
				description: "Telemetry event data",
				content: {
					"application/json": {
						schema: z.union([
							registeredSchemas.SaveAttempt,
							registeredSchemas.SnapshotCreated,
							registeredSchemas.SessionFinalized,
							registeredSchemas.IssueCreated,
							registeredSchemas.IssueResolved,
							registeredSchemas.SessionRestored,
							registeredSchemas.PolicyChanged,
						]),
					},
				},
			},
		},
		responses: {
			200: {
				description: "Event received successfully",
			},
			400: {
				description: "Invalid event data",
			},
		},
	});

	// Generate the OpenAPI document
	const generator = new OpenApiGeneratorV3(registry.definitions);
	const openApiDocument = generator.generateDocument({
		openapi: "3.0.0",
		info: {
			title: "SnapBack Telemetry API",
			version: "1.0.0",
			description: "API specification for SnapBack telemetry events",
		},
		servers: [
			{
				url: "https://api.snapback.dev",
				description: "Production server",
			},
		],
	});

	// Convert to YAML format
	const yamlContent = convertToYAML(openApiDocument);

	// Create the openapi directory if it doesn't exist
	const { mkdir } = await import("node:fs/promises");
	const openapiDir = join(__dirname, "../../openapi");
	await mkdir(openapiDir, { recursive: true });

	// Write the OpenAPI spec to a YAML file
	const outputPath = join(__dirname, "../../openapi/telemetry.yaml");
	await writeFile(outputPath, yamlContent);
	console.log(`Generated OpenAPI spec at ${outputPath}`);
}

function convertToYAML(obj: any, indent = 0): string {
	const spaces = "  ".repeat(indent);

	if (obj === null) {
		return "null";
	}

	if (typeof obj === "boolean" || typeof obj === "number") {
		return obj.toString();
	}

	if (typeof obj === "string") {
		// Check if string needs quotes
		if (
			obj === "" ||
			obj.includes(":") ||
			obj.includes("#") ||
			/\s/.test(obj) ||
			!Number.isNaN(Number(obj)) ||
			obj.includes("{") ||
			obj.includes("}")
		) {
			return `"${obj.replace(/"/g, '\\"')}"`;
		}
		return obj;
	}

	if (Array.isArray(obj)) {
		if (obj.length === 0) {
			return "[]";
		}
		return `\
${obj.map((item) => `${spaces}- ${convertToYAML(item, indent + 1).includes("\n") ? `\n  ${convertToYAML(item, indent + 1).replace(/\n/g, "\n  ")}` : convertToYAML(item, indent + 1)}`).join("\n")}`;
	}

	if (typeof obj === "object") {
		const entries = Object.entries(obj);
		if (entries.length === 0) {
			return "{}";
		}
		return `\
${entries
	.map(([key, value]) => {
		const valueStr = convertToYAML(value, indent + 1);
		if (valueStr.includes("\n")) {
			return `${spaces}${key}:\n${valueStr.replace(/^/gm, "  ")}`;
		}
		return `${spaces}${key}: ${valueStr}`;
	})
	.join("\n")}`;
	}

	return "";
}

// Run the generation
generateOpenAPISpec().catch(console.error);
