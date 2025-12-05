# @snapback-oss/contracts

[![npm version](https://badge.fury.io/js/@snapback-oss%2Fcontracts.svg)](https://www.npmjs.com/package/@snapback-oss/contracts)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> TypeScript types and Zod schemas for the SnapBack platform

Part of the [SnapBack](https://snapback.dev) open-core ecosystem - automated snapshot management and file protection for developers.

## Installation

```bash
npm install @snapback-oss/contracts
# or
pnpm add @snapback-oss/contracts
# or
yarn add @snapback-oss/contracts
```

## Usage

### Events

```typescript
import { SnapshotCreatedEvent, validateEvent } from '@snapback-oss/contracts';

// Type-safe event handling
const event: SnapshotCreatedEvent = {
  type: 'snapshot.created',
  payload: {
    snapshotId: 'snap_123',
    timestamp: Date.now(),
  },
};

// Validate with Zod
const result = validateEvent(event);
```

### Types

```typescript
import type { Snapshot, FileProtection } from '@snapback-oss/contracts';

const snapshot: Snapshot = {
  id: 'snap_123',
  files: [],
  createdAt: new Date(),
};
```

### Session Management

```typescript
import { generateSessionId, validateSession } from '@snapback-oss/contracts';

const sessionId = generateSessionId();
```

## What's Included

### Public API (OSS)
- ✅ Event types and schemas
- ✅ Snapshot types
- ✅ Session management
- ✅ ID generation utilities
- ✅ Validation helpers

### Not Included (Proprietary)
- ❌ Subscription/tier types
- ❌ Dashboard schemas
- ❌ Analytics events
- ❌ Payment integration types

## Architecture

This package is part of SnapBack's **open-core model**:

- **This repo** (`@snapback-oss/contracts`): Core types safe for public use
- **Private repo**: Full platform including business logic

Changes to this package are automatically synced from the main SnapBack monorepo.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development

```bash
# Clone this repository
git clone https://github.com/snapback-dev/contracts.git

# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Links

- **Main Repository**: [Marcelle-Labs/snapback.dev](https://github.com/Marcelle-Labs/snapback.dev) (private source)
- **Documentation**: [docs.snapback.dev](https://docs.snapback.dev)
- **Website**: [snapback.dev](https://snapback.dev)
- **NPM**: [@snapback-oss/contracts](https://www.npmjs.com/package/@snapback-oss/contracts)

## Related Packages

- [`@snapback-oss/sdk`](https://github.com/snapback-dev/sdk) - Client SDK
- [`@snapback-oss/infrastructure`](https://github.com/snapback-dev/infrastructure) - Logging & tracing
- [`@snapback-oss/events`](https://github.com/snapback-dev/events) - Event bus

## License

Apache-2.0 © SnapBack

## Support

- 📖 [Documentation](https://docs.snapback.dev)
- 💬 [Discord Community](https://discord.gg/snapback)
- 🐛 [Report Issues](https://github.com/snapback-dev/contracts/issues)
- 📧 [Email Support](mailto:support@snapback.dev)
