/**
 * Risk Score Conversion Utilities
 *
 * Provides conversion functions between different risk scoring scales for backward compatibility.
 * SnapBack standardizes on 0-10 scale as of Phase 16, but legacy code may use 0-1 or 0-100 scales.
 *
 * @module risk-conversion
 */

/**
 * Risk scoring scales supported by SnapBack
 */
export type RiskScale = "0-1" | "0-10" | "0-100";

/**
 * Convert risk score from 0-1 scale to 0-10 scale
 *
 * @param score - Risk score on 0-1 scale (e.g., 0.5)
 * @returns Risk score on 0-10 scale (e.g., 5.0)
 *
 * @example
 * ```typescript
 * convertRisk_0_1_to_0_10(0.5); // 5.0
 * convertRisk_0_1_to_0_10(0.8); // 8.0
 * convertRisk_0_1_to_0_10(1.0); // 10.0
 * ```
 */
export function convertRisk_0_1_to_0_10(score: number): number {
	return Math.min(10, Math.max(0, score * 10));
}

/**
 * Convert risk score from 0-10 scale to 0-1 scale
 *
 * @param score - Risk score on 0-10 scale (e.g., 5.0)
 * @returns Risk score on 0-1 scale (e.g., 0.5)
 *
 * @example
 * ```typescript
 * convertRisk_0_10_to_0_1(5.0); // 0.5
 * convertRisk_0_10_to_0_1(8.0); // 0.8
 * convertRisk_0_10_to_0_1(10.0); // 1.0
 * ```
 */
export function convertRisk_0_10_to_0_1(score: number): number {
	return Math.min(1, Math.max(0, score / 10));
}

/**
 * Convert risk score from 0-100 scale to 0-10 scale
 *
 * @param score - Risk score on 0-100 scale (e.g., 50)
 * @returns Risk score on 0-10 scale (e.g., 5.0)
 *
 * @example
 * ```typescript
 * convertRisk_0_100_to_0_10(50); // 5.0
 * convertRisk_0_100_to_0_10(80); // 8.0
 * convertRisk_0_100_to_0_10(100); // 10.0
 * ```
 */
export function convertRisk_0_100_to_0_10(score: number): number {
	return Math.min(10, Math.max(0, score / 10));
}

/**
 * Convert risk score from 0-10 scale to 0-100 scale
 *
 * @param score - Risk score on 0-10 scale (e.g., 5.0)
 * @returns Risk score on 0-100 scale (e.g., 50)
 *
 * @example
 * ```typescript
 * convertRisk_0_10_to_0_100(5.0); // 50
 * convertRisk_0_10_to_0_100(8.0); // 80
 * convertRisk_0_10_to_0_100(10.0); // 100
 * ```
 */
export function convertRisk_0_10_to_0_100(score: number): number {
	return Math.min(100, Math.max(0, score * 10));
}

/**
 * Normalize any risk score to the standard 0-10 scale
 *
 * This is the primary conversion function for migrating legacy code to the standard scale.
 *
 * @param score - Risk score in any supported scale
 * @param fromScale - The scale of the input score
 * @returns Risk score normalized to 0-10 scale
 *
 * @example
 * ```typescript
 * normalizeRiskScore(0.5, '0-1'); // 5.0
 * normalizeRiskScore(5.0, '0-10'); // 5.0
 * normalizeRiskScore(50, '0-100'); // 5.0
 * ```
 */
export function normalizeRiskScore(score: number, fromScale: RiskScale): number {
	switch (fromScale) {
		case "0-1":
			return convertRisk_0_1_to_0_10(score);
		case "0-10":
			return Math.min(10, Math.max(0, score));
		case "0-100":
			return convertRisk_0_100_to_0_10(score);
	}
}

/**
 * Get severity level for a risk score on 0-10 scale
 *
 * Uses SnapBack's standard severity thresholds:
 * - low: 0 - 2.9
 * - medium: 3.0 - 4.9
 * - high: 5.0 - 6.9
 * - critical: 7.0 - 10.0
 *
 * @param score - Risk score on 0-10 scale
 * @returns Severity level
 *
 * @example
 * ```typescript
 * getSeverity(2.0); // 'low'
 * getSeverity(4.0); // 'medium'
 * getSeverity(6.0); // 'high'
 * getSeverity(8.0); // 'critical'
 * ```
 */
export function getSeverity(score: number): "low" | "medium" | "high" | "critical" {
	const normalizedScore = Math.min(10, Math.max(0, score));

	if (normalizedScore < 3.0) {
		return "low";
	}
	if (normalizedScore < 5.0) {
		return "medium";
	}
	if (normalizedScore < 7.0) {
		return "high";
	}
	return "critical";
}

/**
 * Check if a risk score exceeds a threshold
 *
 * @param score - Risk score on 0-10 scale
 * @param threshold - Threshold value on 0-10 scale
 * @returns True if score exceeds threshold
 *
 * @example
 * ```typescript
 * exceedsThreshold(8.5, 8.0); // true
 * exceedsThreshold(7.5, 8.0); // false
 * ```
 */
export function exceedsThreshold(score: number, threshold: number): boolean {
	return score >= threshold;
}

/**
 * Batch convert multiple risk scores to 0-10 scale
 *
 * @param scores - Array of risk scores
 * @param fromScale - The scale of the input scores
 * @returns Array of normalized risk scores
 *
 * @example
 * ```typescript
 * batchNormalize([0.5, 0.8, 1.0], '0-1'); // [5.0, 8.0, 10.0]
 * batchNormalize([50, 80, 100], '0-100'); // [5.0, 8.0, 10.0]
 * ```
 */
export function batchNormalize(scores: number[], fromScale: RiskScale): number[] {
	return scores.map((score) => normalizeRiskScore(score, fromScale));
}

/**
 * Round risk score to specified decimal places
 *
 * @param score - Risk score
 * @param decimals - Number of decimal places (default: 1)
 * @returns Rounded risk score
 *
 * @example
 * ```typescript
 * roundRiskScore(5.12345); // 5.1
 * roundRiskScore(5.12345, 2); // 5.12
 * roundRiskScore(5.12345, 0); // 5
 * ```
 */
export function roundRiskScore(score: number, decimals = 1): number {
	const multiplier = 10 ** decimals;
	return Math.round(score * multiplier) / multiplier;
}
