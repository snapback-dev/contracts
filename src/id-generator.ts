import { nanoid } from "nanoid";

/**
 * Generate a unique ID with optional prefix
 * @param prefix Optional prefix for the ID (e.g., 'user', 'session')
 * @returns Unique ID string
 */
export function generateId(prefix?: string): string {
	const id = nanoid();
	return prefix ? `${prefix}-${id}` : id;
}

/**
 * Generate a snapshot ID in the standard format
 * Format: snapshot-<timestamp>-<random>
 * @returns Snapshot ID string
 */
export function generateSnapshotId(): string {
	return `snapshot-${Date.now()}-${nanoid(9)}`;
}
