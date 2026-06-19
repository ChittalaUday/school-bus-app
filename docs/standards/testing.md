# Testing Standards

---

## Philosophy

Tests verify behavior, not implementation.

- Test what the code does, not how it does it
- Don't test Prisma, Fastify, or Redis internals — test your code's use of them
- Prefer integration tests over mocks for database interactions

---

## Test Types

### Unit Tests
- Pure functions with no I/O
- Zod schema validation logic
- Business logic utilities (ETA calculation, deviation detection)
- Located next to source: `trip-service.test.ts`

### Integration Tests
- API route handlers with real database
- Use a test PostgreSQL database (seeded fresh per test file)
- BullMQ workers with real Redis
- Located in `__tests__/integration/`

### End-to-End Tests (future)
- Full flows via API: create school → create route → start trip → track
- Playwright for web UI flows

---

## Test Framework

| Project | Framework |
| -------- | ----------- |
| `apps/api` | Vitest |
| `apps/web` | Vitest + React Testing Library |
| `apps/mobile` | Jest + React Native Testing Library |
| `packages/shared` | Vitest |

---

## Coverage Requirements

| Scope | Minimum Coverage |
| ----------------------------- | ---------------- |
| Business logic (services) | 80% |
| API route handlers | 70% |
| Zod schemas | 100% (they are the contract) |
| UI components | Not enforced |

---

## Database in Tests

Use a real test database. No mocking Prisma.

```typescript
// test setup
beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE trips CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

Rationale: see [ADR-003](../adr/ADR-003-postgresql-postgis.md). Mocking Prisma hides PostGIS query errors.

---

## Test Naming

```typescript
describe("TripService", () => {
  describe("startTrip", () => {
    it("transitions status from SCHEDULED to ACTIVE", async () => {});
    it("throws if trip is already ACTIVE", async () => {});
    it("throws if driver is not assigned to this trip", async () => {});
  });
});
```

Pattern: `describe(unit) → describe(method) → it(behavior)`

---

## What Not to Test

- Framework behavior (Fastify routing, Prisma query building)
- Third-party library internals
- `console.log` output
- TypeScript types (the compiler does this)
