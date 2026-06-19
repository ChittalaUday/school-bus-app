# API Rules — `apps/api`

These rules apply exclusively to `apps/api`. Follow them on every change.

---

## Module Boundaries

- A module may only import from: its own files, `plugins/`, `utils/`, `packages/shared`
- Modules must NOT import from other modules directly
- Cross-module communication happens through service calls injected via Fastify's decorator pattern or passed as arguments — never via direct file imports between modules

```typescript
// Forbidden — tracking importing from trips directly
import { tripService } from "../trips/trip.service";

// Allowed — inject via plugin or pass as dependency
```

## Route Handlers

- Route handlers must be thin — no business logic
- All logic in the service layer
- Handler responsibility: validate input shape, call service, return response
- Max 15 lines per handler

## Services

- Services must be pure functions or classes with no Fastify dependency
- Services receive Prisma, Redis as constructor arguments — not imported globally
- Services are fully unit-testable in isolation

## Zod Schemas

- Every route must have a Zod schema for body, params, and query
- Schemas defined in `module.schema.ts` — not inline in route definitions
- Schemas exported from `packages/shared` when used by web or mobile

## Database Access

- All database access through Prisma — no raw SQL except PostGIS spatial queries
- PostGIS raw queries only in `utils/postgis.ts` — nowhere else
- Never access the database from a route handler directly — always through service

## Error Handling

- Use `AppError` class for all thrown errors — never throw raw strings
- Never swallow errors silently (`catch` blocks must either rethrow or handle explicitly)
- All async route handlers must be wrapped — Fastify handles this automatically with `async/await`

## Logging

- Use `req.log` (Fastify's per-request logger) inside handlers
- Use `fastify.log` inside plugins and workers
- Never use `console.log`
- Log at entry and error points — not at every line

## Testing

- Every service method must have at least one test
- Integration tests use a real test database — no Prisma mocks
- Tests must not depend on execution order (each test seeds its own data)

## Naming (API-specific)

| Item | Convention |
| --------------------- | -------------------- |
| Fastify plugins | `*.plugin.ts` |
| Route files | `*.routes.ts` |
| Service files | `*.service.ts` |
| Schema files | `*.schema.ts` |
| Worker files | `*.worker.ts` |
| BullMQ job names | `kebab-case` string |
| Socket.IO events | `noun:verb` |
