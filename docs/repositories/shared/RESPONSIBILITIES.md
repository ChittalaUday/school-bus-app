# Shared Responsibilities — `packages/shared`

---

## Owns

- TypeScript types for all domain entities (Trip, Bus, Route, Stop, Student, User, etc.)
- Zod schemas for API request/response contracts
- Zod schemas for form validation (shared with API for consistency)
- Shared constants: UserRole, TripStatus, socket event names, error codes

## Does NOT Own

- Business logic of any kind
- Database schemas (owned by `apps/api` via Prisma)
- API route definitions
- UI components
- Platform-specific utilities
- Fastify plugins, React hooks, or React Native hooks

## Boundary Rules

- Imports nothing from `apps/*`
- Consumed by all apps but owns nothing from them
- Is the only place where type contracts between projects are defined
