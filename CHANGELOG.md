# @snapback-oss/contracts

## 0.1.0 (2025-12-04)

### Features

**Initial public release of TypeScript contracts and type definitions**

- **Event Types**: Type-safe event definitions for snapshot lifecycle
  - `SnapshotCreated`, `SnapshotRestored`, `FileProtected`
  - Legacy event migration utilities
  - Core event schemas with Zod validation

- **Type Definitions**: Comprehensive TypeScript types
  - `Snapshot` type with metadata
  - `FileProtection` configuration
  - Session management types

- **Utilities**:
  - Session ID generation with nanoid
  - Type-safe ID generators
  - JSON schema validation helpers

### What's Included

- ✅ Event type definitions (core, legacy)
- ✅ Snapshot and file types
- ✅ Session management utilities
- ✅ Zod validation schemas
- ✅ ID generation helpers

### What's Not Included (Private)

- ❌ Subscription/tier types
- ❌ Dashboard schemas
- ❌ Analytics event types
- ❌ Payment integration types

---

**Full Changelog**: https://github.com/snapback-dev/contracts/commits/main
