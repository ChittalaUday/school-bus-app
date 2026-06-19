# Security Standards

---

## Authentication

- JWT access tokens: 15-minute expiry
- Refresh tokens: 30-day expiry, opaque, stored in PostgreSQL
- Refresh tokens are rotated on every use (old token invalidated immediately)
- Tokens transmitted in `Authorization: Bearer <token>` header — never in URL params
- Never store tokens in `localStorage` on web — use `httpOnly` cookies or secure memory

## Authorization

- Role-based access control enforced in Fastify preHandler hooks — not in service layer
- Every protected route must explicitly declare required role(s)
- Parent can only access data for their own children — enforce with userId filter on all queries
- Driver can only update location for their currently assigned active trip

## Input Validation

- All API inputs validated with Zod before any database or business logic
- Never use raw string interpolation in database queries — Prisma parameterized queries only
- Reject unexpected fields — use `z.object().strict()` at API boundaries

## Passwords

- Hashed with `bcrypt` (cost factor 12)
- Never stored in plaintext
- Never logged

## Secrets

- All secrets in environment variables — never in source code
- No `.env` files committed to git
- Rotate JWT secrets if compromised — invalidates all active sessions (acceptable for security events)

## Logging

- Never log passwords, tokens, or full request bodies containing sensitive data
- Log `userId`, `tripId`, `busId` for audit trail — not PII like student names in log lines
- Pino `redact` config must mask sensitive fields

```typescript
const logger = pino({
  redact: ["req.headers.authorization", "body.password", "body.token"],
});
```

## HTTP Headers

Required via `@fastify/helmet`:

```
Content-Security-Policy
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security (HTTPS only)
```

## Rate Limiting

- `@fastify/rate-limit` on all auth endpoints: 10 requests per minute per IP
- Location tracking endpoint: 60 requests per minute per authenticated driver (1 per second)

## CORS

- Explicit allowlist — no wildcard `*` in production
- Allowed origins: `app.govexa.com`, mobile app deep link scheme

## SQL / Injection

- All database access through Prisma — no raw SQL except PostGIS spatial queries
- PostGIS raw queries use Prisma `$queryRaw` with tagged template literals (parameterized)

```typescript
// Safe
await prisma.$queryRaw`
  SELECT * FROM stops
  WHERE ST_DWithin(coordinates::geography, ST_Point(${lng}, ${lat})::geography, ${radiusMeters})
`;

// Never do this
await prisma.$queryRawUnsafe(`SELECT * FROM stops WHERE id = '${id}'`);
```

## Dependency Security

- `pnpm audit` runs in CI — fails on high/critical vulnerabilities
- Dependabot configured for automated dependency update PRs
- No unpinned `*` versions in `package.json`
