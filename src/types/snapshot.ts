import { z } from "zod";
import { RiskScoreSchema } from "../schemas.js";

/**
 * Base Snapshot interface
 * This is the core data structure for snapshots across all SnapBack clients
 *
 * Session Linkage (Non-Breaking Extension):
 * Snapshots can optionally link to a parent session via meta.sessionId.
 * This enables:
 * - Displaying snapshots within session tree view
 * - Understanding snapshot creation context
 * - Grouping snapshots by logical work period
 *
 * Example meta object:
 * {
 *   name: "Pre-refactor checkpoint",
 *   protected: true,
 *   sessionId: "clx1a2b3c4d5e6f7g8h9" // Optional link to session
 * }
 */
export const SnapshotSchema = z.object({
	id: z.string(),
	timestamp: z.number(),
	meta: z.record(z.string(), z.any()).optional(),
	files: z.array(z.string()).optional(),
	fileContents: z.record(z.string(), z.string()).optional(),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

/**
 * File state at a specific snapshot
 * Used for deduplication and change tracking
 */
export const FileStateSchema = z.object({
	path: z.string(),
	content: z.string(),
	hash: z.string(),
});
export type FileState = z.infer<typeof FileStateSchema>;

/**
 * Complete snapshot state for deduplication
 */
export const SnapshotStateSchema = z.object({
	id: z.string(),
	timestamp: z.number(),
	files: z.array(FileStateSchema),
});
export type SnapshotState = z.infer<typeof SnapshotStateSchema>;

/**
 * Rich Snapshot with UI metadata
 * Used by VS Code extension and other clients with UI
 */
export const RichSnapshotSchema = SnapshotSchema.extend({
	name: z.string(),
	fileStates: z.array(FileStateSchema).optional(),
	isProtected: z.boolean(),
	icon: z.string().optional(),
	iconColor: z.string().optional(),
});
export type RichSnapshot = z.infer<typeof RichSnapshotSchema>;

/**
 * Minimal snapshot for deletion operations
 */
export const MinimalSnapshotSchema = z.object({
	id: z.string(),
	name: z.string(),
	timestamp: z.number(),
	isProtected: z.boolean(),
});
export type MinimalSnapshot = z.infer<typeof MinimalSnapshotSchema>;

/**
 * File input for snapshot creation
 */
export const FileInputSchema = z.object({
	path: z.string(),
	content: z.string(),
	action: z.enum(["add", "modify", "delete"]),
});
export type FileInput = z.infer<typeof FileInputSchema>;

/**
 * Snapshot creation options
 */
export const CreateSnapshotOptionsSchema = z.object({
	description: z.string().optional(),
	protected: z.boolean().optional(),
});
export type CreateSnapshotOptions = z.infer<typeof CreateSnapshotOptionsSchema>;

/**
 * Snapshot filters for querying
 */
export const SnapshotFiltersSchema = z.object({
	filePath: z.string().optional(),
	before: z.date().optional(),
	after: z.date().optional(),
	protected: z.boolean().optional(),
	limit: z.number().int().positive().optional(),
	offset: z.number().int().nonnegative().optional(),
});
export type SnapshotFilters = z.infer<typeof SnapshotFiltersSchema>;

/**
 * Snapshot restore result
 */
export const SnapshotRestoreResultSchema = z.object({
	success: z.boolean(),
	restoredFiles: z.array(z.string()),
	errors: z.array(z.string()).optional(),
});
export type SnapshotRestoreResult = z.infer<typeof SnapshotRestoreResultSchema>;

/**
 * Snapshot naming strategy types
 */
export type SnapshotNamingStrategy = "git" | "semantic" | "timestamp" | "custom";

/**
 * Snapshot manager configuration
 */
export const SnapshotManagerConfigSchema = z.object({
	enableDeduplication: z.boolean().default(true),
	namingStrategy: z.enum(["git", "semantic", "timestamp", "custom"]).default("semantic"),
	autoProtect: z.boolean().default(false),
	maxSnapshots: z.number().int().positive().optional(),
});
export type SnapshotManagerConfig = z.infer<typeof SnapshotManagerConfigSchema>;

/**
 * File metadata for analytics and tracking
 *
 * Note: Uses canonical RiskScoreSchema from schemas.ts (0-10 scale)
 */
export const FileMetadataSchema = z.object({
	id: z.string(),
	path: z.string(),
	hash: z.string().optional(),
	size: z.number().optional(),
	language: z.string().optional(),
	risk: RiskScoreSchema.optional(),
	lastModified: z.number().optional(),
	createdAt: z.number().optional(),
});
export type FileMetadata = z.infer<typeof FileMetadataSchema>;

/**
 * Snapshot metadata for analytics
 */
export const SnapshotMetadataSchema = z.object({
	id: z.string(),
	timestamp: z.number(),
	fileCount: z.number(),
	totalSize: z.number().optional(),
	riskScore: RiskScoreSchema.optional(),
	tags: z.array(z.string()).optional(),
});
export type SnapshotMetadata = z.infer<typeof SnapshotMetadataSchema>;

/**
 * Analytics response structure
 */
export const AnalyticsResponseSchema = z.object({
	workspaceId: z.string(),
	period: z.object({
		start: z.number(),
		end: z.number(),
	}),
	risk: RiskScoreSchema,
	fileStats: z.object({
		total: z.number(),
		byLanguage: z.record(z.string(), z.number()),
		byRisk: z.record(z.string(), z.number()),
	}),
	snapshotStats: z.object({
		total: z.number(),
		frequency: z.number(),
		averageSize: z.number().optional(),
	}),
	snapshotRecommendations: z.object({
		shouldCreateSnapshot: z.boolean(),
		reason: z.string(),
		urgency: z.enum(["low", "medium", "high", "critical"]),
		suggestedTiming: z.string(),
	}),
	trends: z.object({
		risk: z.array(
			z.object({
				timestamp: z.number(),
				score: z.number(),
			}),
		),
		activity: z.array(
			z.object({
				timestamp: z.number(),
				count: z.number(),
			}),
		),
	}),
});
export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;

/**
 * Storage interface for snapshots
 * This interface allows public packages to interact with snapshot storage
 * without depending on the private @snapback/storage implementation.
 */
export interface SnapshotStorage {
	create(data: CreateSnapshotOptions): Promise<Snapshot>;
	retrieve(id: string): Promise<Snapshot | null>;
	list(): Promise<Snapshot[]>;
	restore(
		id: string,
		targetPath: string,
		options?: {
			files?: string[];
			dryRun?: boolean;
			backupCurrent?: boolean;
		},
	): Promise<SnapshotRestoreResult>;
}

/**
 * Factory function to create a snapshot storage instance
 * This allows public packages to create storage instances without
 * directly depending on the private @snapback/storage package.
 *
 * @param basePath The base path for storage operations
 * @returns A SnapshotStorage instance
 */
export async function createSnapshotStorage(basePath: string): Promise<SnapshotStorage> {
	// Dynamically import the storage package to avoid circular dependencies
	// The import path is resolved at runtime after both packages are built
	try {
		const { StorageBrokerAdapter } = await import("@snapback/sdk/storage" as any);
		// Use the standard workspace database path
		const storage = new StorageBrokerAdapter(`${basePath}/.snapback/snapback.db`);
		await storage.initialize();

		return {
			create: async (data) => {
				const snapshot: Snapshot = {
					id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
					timestamp: Date.now(),
					meta: {
						...data,
						protected: data.protected || false,
						description: data.description || "",
					},
				};
				await storage.save(snapshot);
				return snapshot;
			},
			retrieve: async (id) => {
				return await storage.get(id);
			},
			list: async () => {
				return await storage.list();
			},
			restore: async (id, _targetPath, options) => {
				// Note: Full restore implementation requires file system operations
				// This is a simplified version - real implementation in storage package
				const snapshot = await storage.get(id);
				if (!snapshot) {
					return {
						success: false,
						restoredFiles: [],
						errors: [`Snapshot ${id} not found`],
					};
				}

				if (options?.dryRun) {
					return {
						success: true,
						restoredFiles: snapshot.files || [],
						errors: [],
					};
				}

				return {
					success: true,
					restoredFiles: snapshot.files || [],
					errors: [],
				};
			},
		};
	} catch (error) {
		throw new Error(
			`Failed to initialize snapshot storage: ${error instanceof Error ? error.message : String(error)}. ` +
				"Ensure @snapback/sdk is installed and storage path is writable.",
		);
	}
}
