# API — `apps/api`

Fastify backend. All business logic lives here.

---

## Purpose

The single backend service for Govexa. Handles REST API, Socket.IO realtime, BullMQ background workers, and GraphHopper routing integration.

## Stack

| Technology | Role |
| ---------- | ---- |
| Node.js | Runtime |
| TypeScript | Language |
| Fastify | HTTP framework |
| Prisma | ORM |
| Zod | Validation |
| JWT | Authentication |
| Socket.IO | Realtime |
| BullMQ | Background jobs |
| Redis | Cache + queue backend |
| Pino | Logging |
| Vitest | Testing |
| Swagger/OpenAPI | API docs |

## Setup (when project is created)

```bash
cd apps/api
pnpm install
cp .env.example .env.local   # fill in values
pnpm db:migrate              # run Prisma migrations
pnpm db:seed                 # seed demo data
pnpm dev                     # start with hot reload
```

## Commands

```bash
pnpm dev          # Development server with hot reload
pnpm build        # TypeScript compile
pnpm start        # Run compiled output
pnpm test         # Run all tests
pnpm test:watch   # Watch mode
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm db:migrate   # Apply Prisma migrations
pnpm db:generate  # Regenerate Prisma client
pnpm db:seed      # Seed database
pnpm db:studio    # Open Prisma Studio
```

## Ports

| Service | Port |
| -------- | ---- |
| API | 3000 |
| Swagger | 3000/docs |

## Related Docs

- [Architecture](ARCHITECTURE.md)
- [Rules](RULES.md)
- [Constraints](CONSTRAINTS.md)
- [Responsibilities](RESPONSIBILITIES.md)
- [System Overview](../../architecture/system-overview.md)
- [Data Flow](../../architecture/data-flow.md)
