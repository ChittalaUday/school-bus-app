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

## Postman Collection (mandatory)

The Postman collection at `apps/api/postman/govexa-api.postman_collection.json` is the authoritative API contract for manual testing and integration documentation.

**Rules:**

- Every new route added to `apps/api` MUST have a corresponding request added to the Postman collection in the same PR
- Every changed route (URL, method, request body, response shape) MUST have its Postman entry updated in the same PR
- Deleted routes MUST have their Postman entry removed in the same PR
- A PR that adds or changes routes but does not update the collection will not pass review

**Collection structure:**

The collection is organized by domain module (System, Auth, Students, Parents, Drivers, Buses, Routes, Trips, Tracking, Attendance, Incidents). Each request must include:

| Field | Requirement |
|---|---|
| Name | Clear, action-oriented (e.g. "Create Student", "Start Trip") |
| Method + URL | Exact path using `{{baseUrl}}` variable |
| Auth | Set to "Inherit from parent" (Bearer token applied at collection level) or "No Auth" for public endpoints |
| Description | Purpose, required auth role, request body fields, and example responses (200, 4xx) |
| Example response | At least one saved example response for the happy path |

**Environment variables used:**

| Variable | Purpose |
|---|---|
| `{{baseUrl}}` | API base URL — defaults to `http://localhost:3000` |
| `{{accessToken}}` | JWT access token — set via login request |
| `{{refreshToken}}` | JWT refresh token — set via login request |

---

## Comments

- Do not add comments that describe what the code does — well-named variables, functions, and types do that
- Only add a comment when the **why** is non-obvious: a hidden constraint, a subtle invariant, a workaround for a specific external behavior, or something that would genuinely surprise a future reader
- No commented-out code — delete it; git history is the record
- One line max — no multi-line comment blocks or JSDoc paragraphs on internal code

---

## Commits

- Format: `type(scope): GOV-{ID} short description`
- Allowed types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Subject line: imperative mood, max 72 characters, no trailing period
- One logical change per commit — never bundle unrelated changes
- Never commit: commented-out code, `console.log`, `debugger` statements, or TODO comments without a ticket reference (`GOV-{ID}`)
- Message must describe **why**, not what — the diff already shows what changed

---

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
