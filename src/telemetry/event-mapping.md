# Telemetry Event Mapping

This document maps the existing 60+ telemetry events to the new 7 core events and their derived metrics calculations.

## Core Events

1. **save_attempt** - Tracks file save operations with protection outcomes
2. **snapshot_created** - Tracks snapshot creation with storage efficiency metrics
3. **session_finalized** - Tracks user sessions with summary metrics
4. **issue_created** - Tracks new issues detected
5. **issue_resolved** - Tracks issue resolution actions
6. **session_restored** - Tracks session restoration operations
7. **policy_changed** - Tracks policy configuration changes

## Event Mapping

### Extension Lifecycle Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| extension.activated | - | Extension activation count, version distribution |
| extension.deactivated | - | Extension deactivation count |

### Command Execution Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| command.execution | - | Command usage frequency, success rate, performance |

### Snapshot Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| snapshot.created | snapshot_created | Snapshot creation frequency, file count distribution |

### SnapBack Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| snapback.used | session_restored | Restore success rate, performance, file count |

### Risk Detection Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| risk.detected | issue_created | Risk detection frequency, pattern distribution, confidence scores |

### UI Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| view.activated | - | UI component usage |
| notification.shown | - | Notification effectiveness |
| feature.used | - | Feature adoption rates |

### Error Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| error | - | Error frequency, type distribution |

### Walkthrough Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| walkthrough.step.completed | - | Onboarding completion rates |

### Onboarding Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| onboarding.protection.assigned | save_attempt | Protection assignment frequency, level distribution |
| onboarding.phase.progressed | - | Onboarding progression |
| onboarding.contextualPrompt.shown | - | Contextual help usage |

### Security Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| signature.verification.success | - | Signature verification success rate |
| signature.verification.failed | - | Signature verification failure rate |

### Rules Events

| Existing Event | Core Event | Derived Metrics |
|----------------|------------|-----------------|
| rules.cached.fallback | - | Cache fallback frequency |

## Derived Metrics Calculations

### Save Operations
- **Total save attempts**: Count of save_attempt events
- **Save success rate**: (saved + canceled) / total attempts
- **Block rate**: blocked / total attempts
- **AI assistance rate**: ai_present=true / total attempts

### Snapshot Efficiency
- **Storage savings**: Sum of (bytes_original - bytes_stored) across snapshots
- **Deduplication rate**: dedup_hit=true / total snapshots
- **Average creation latency**: Average of latency_ms

### Session Metrics
- **Session duration**: Average of duration_ms
- **AI burst usage**: ai_burst=true / total sessions
- **Severity distribution**: Count of sessions by highest_severity

### Issue Tracking
- **Issue creation rate**: Count of issue_created events
- **Resolution rate**: Count of issue_resolved events
- **Time to resolution**: Time between issue_created and issue_resolved
- **Resolution distribution**: Count by resolution type

### Restore Performance
- **Restore success rate**: Success rate from session_restored events
- **Average restore time**: Average of time_to_restore_ms
- **Restore frequency**: Count of session_restored events

### Policy Changes
- **Policy change frequency**: Count of policy_changed events
- **Policy migration patterns**: From/to combinations