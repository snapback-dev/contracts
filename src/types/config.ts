import { z } from "zod";

/**
 * Configuration file types
 */
export const ConfigFileTypeSchema = z.enum([
	"package",
	"typescript",
	"linting",
	"build",
	"environment",
	"testing",
	"framework",
	"database",
	"ci",
]);
export type ConfigFileType = z.infer<typeof ConfigFileTypeSchema>;

/**
 * Supported programming languages
 */
export const SupportedLanguageSchema = z.enum(["javascript", "typescript", "python", "universal"]);
export type SupportedLanguage = z.infer<typeof SupportedLanguageSchema>;

/**
 * File baseline information for config files
 */
export const FileBaselineSchema = z.object({
	path: z.string(),
	hash: z.string(),
	timestamp: z.number(),
	size: z.number(),
});
export type FileBaseline = z.infer<typeof FileBaselineSchema>;

/**
 * Base configuration file interface
 */
export const ConfigFileSchema = z.object({
	path: z.string(),
	type: ConfigFileTypeSchema,
	language: SupportedLanguageSchema,
	critical: z.boolean().default(false),
	baseline: FileBaselineSchema.optional(),
});
export type ConfigFile = z.infer<typeof ConfigFileSchema>;

/**
 * Detected configuration file
 */
export const DetectedConfigFileSchema = z.object({
	type: z.string(),
	path: z.string(),
	name: z.string(),
	critical: z.boolean().default(false),
});
export type DetectedConfigFile = z.infer<typeof DetectedConfigFileSchema>;

/**
 * Config parse result
 */
export const ConfigParseResultSchema = z.object({
	content: z.any(),
	valid: z.boolean(),
	error: z.string().optional(),
	metadata: z.record(z.string(), z.any()).optional(),
});
export type ConfigParseResult = z.infer<typeof ConfigParseResultSchema>;

/**
 * Config validation result
 */
export const ConfigValidationResultSchema = z.object({
	valid: z.boolean(),
	errors: z.array(z.string()).default([]),
	warnings: z.array(z.string()).default([]),
});
export type ConfigValidationResult = z.infer<typeof ConfigValidationResultSchema>;

/**
 * Config file change
 */
export const ConfigChangeSchema = z.object({
	type: z.enum(["added", "modified", "deleted"]),
	file: z.string(),
	timestamp: z.number(),
	baseline: FileBaselineSchema.optional(),
});
export type ConfigChange = z.infer<typeof ConfigChangeSchema>;

/**
 * Config detection patterns
 */
export interface ConfigDetectionPattern {
	pattern: string | RegExp;
	type: ConfigFileType;
	language: SupportedLanguage;
	critical: boolean;
}

/**
 * Config manager options
 */
export const ConfigManagerOptionsSchema = z.object({
	autoDetect: z.boolean().default(true),
	watchChanges: z.boolean().default(true),
	autoProtect: z.boolean().default(true),
	customPatterns: z.array(z.any()).optional(),
});
export type ConfigManagerOptions = z.infer<typeof ConfigManagerOptionsSchema>;

/**
 * Selective snapshot configuration
 */
export const SelectiveSnapshotConfigSchema = z.object({
	enabled: z.boolean(),
	patterns: z.array(z.string()).optional(),
	threshold: z.number().optional(),
	includePatterns: z.array(z.string()).optional(),
	excludePatterns: z.array(z.string()).optional(),
});
export type SelectiveSnapshotConfig = z.infer<typeof SelectiveSnapshotConfigSchema>;
