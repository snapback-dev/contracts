/**
 * Audit Export Contracts - Define export formats
 *
 * Automatic mode selection based on payload size:
 * - ≤10MB: InlineExport (direct data return)
 * - >10MB: UrlExport (S3 presigned URL, 7-day expiration)
 *
 * Alpha: Available for Solo+ tier (not just Team+)
 */

/**
 * Inline export for small payloads (≤10MB)
 */
export interface InlineExport {
	mode: "inline";
	data: string; // CSV or JSON string
	filename: string;
	contentType: "text/csv" | "application/json";
	sizeBytes: number;
	recordCount: number;
}

/**
 * URL export for large payloads (>10MB)
 * Uses S3 presigned URL with 7-day expiration
 */
export interface UrlExport {
	mode: "url";
	url: string; // Presigned S3 URL
	filename: string;
	contentType: "text/csv" | "application/json";
	sizeBytes: number;
	recordCount: number;
	expiresAt: number; // Unix timestamp
	expiresIn: number; // Seconds until expiration
}

/**
 * Discriminated union of export types
 */
export type AuditExport = InlineExport | UrlExport;

/**
 * Export request parameters
 */
export interface ExportRequest {
	format: "csv" | "json";
	startDate: Date;
	endDate: Date;
	eventTypes?: string[]; // Filter by event types
	userId?: string; // Admin can export for specific user
}

/**
 * Export metadata (for tracking)
 */
export interface ExportMetadata {
	exportId: string;
	requestedBy: string;
	requestedAt: number;
	completedAt?: number;
	status: "pending" | "processing" | "completed" | "failed";
	error?: string;
}

/**
 * Constants
 */
export const EXPORT_CONSTANTS = {
	/** Maximum size for inline export (10MB) */
	MAX_INLINE_SIZE_BYTES: 10 * 1024 * 1024,

	/** S3 presigned URL expiration (7 days in seconds) */
	S3_URL_EXPIRATION_SECONDS: 7 * 24 * 60 * 60,

	/** Supported content types */
	CONTENT_TYPES: {
		CSV: "text/csv" as const,
		JSON: "application/json" as const,
	},
} as const;

/**
 * Type guard for export types
 */
export function isInlineExport(exportData: AuditExport): exportData is InlineExport {
	return exportData.mode === "inline";
}

export function isUrlExport(exportData: AuditExport): exportData is UrlExport {
	return exportData.mode === "url";
}

/**
 * Helper to determine export mode based on size
 */
export function getExportMode(sizeBytes: number): "inline" | "url" {
	return sizeBytes <= EXPORT_CONSTANTS.MAX_INLINE_SIZE_BYTES ? "inline" : "url";
}
