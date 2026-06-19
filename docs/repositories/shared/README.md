# Shared — `packages/shared`

Shared TypeScript types, Zod schemas, and constants used across `apps/api`, `apps/web`, and `apps/mobile`.

---

## Purpose

Single source of truth for the data contracts between the API and its clients. When the API changes a response shape or adds a new field, updating `packages/shared` propagates the change to all consumers with TypeScript errors.

## Contents

```
packages/shared/src/
│
├── types/
│   ├── user.types.ts
│   ├── school.types.ts
│   ├── bus.types.ts
│   ├── route.types.ts
│   ├── trip.types.ts
│   ├── student.types.ts
│   └── tracking.types.ts
│
├── schemas/
│   ├── auth.schema.ts
│   ├── location.schema.ts
│   ├── trip.schema.ts
│   └── route.schema.ts
│
├── constants/
│   ├── roles.ts              # UserRole const object
│   ├── trip-status.ts        # TripStatus const object
│   └── socket-events.ts      # Socket.IO event name constants
│
└── index.ts                  # Barrel export
```

## Usage

```typescript
// In apps/api
import { TripStatus, locationUpdateSchema } from "@govexa/shared";

// In apps/web
import { Trip, UserRole } from "@govexa/shared";

// In apps/mobile
import { SOCKET_EVENTS } from "@govexa/shared";
```

## Rules

- `packages/shared` must have zero runtime dependencies
- Only TypeScript types, Zod schemas, and plain constants
- No Node.js-specific code (no `fs`, `path`, etc.)
- No React or React Native imports
- Treat every export as a public API — breaking changes require a ticket

## Related Docs

- [Architecture](ARCHITECTURE.md)
- [Rules](RULES.md)
- [Constraints](CONSTRAINTS.md)
- [Responsibilities](RESPONSIBILITIES.md)
