# Govexa — AI Agent Rules

You are working on **Govexa**, a school bus tracking and management platform for Hyderabad.

**Read this file completely before taking any action.**

---

## Mandatory Reading Order

Before touching any code, read these files in order:

1. `docs/README.md` — documentation index and project map
2. `docs/workflows/AI_WORKFLOW_RULES.md` — all workflow and governance rules
3. `docs/architecture/system-overview.md` — system architecture
4. The relevant project docs under `docs/repositories/{api|web|mobile|shared}/`

---

## Project Map

```
apps/api/      → Fastify backend (Node.js + TypeScript)
apps/web/      → Next.js admin portal
apps/mobile/   → React Native driver + parent app
packages/shared/ → Shared types, Zod schemas, constants
infrastructure/ → Docker, Nginx, CI/CD
docs/          → All documentation
```

Each project has its own `README.md`, `ARCHITECTURE.md`, `RULES.md`, `CONSTRAINTS.md`, and `RESPONSIBILITIES.md` under `docs/repositories/`.

---

## Core Rules (non-negotiable)

### One Ticket At A Time

- Every change links to one Linear ticket (`GOV-{ID}`)
- Never implement multiple unrelated things in one response
- If a task is too large, decompose into subtasks and implement one at a time

### Small Changes Only

- Never generate an entire module, system, or feature in one response
- Max one logical unit per response (one endpoint, one component, one worker)
- Propose, get confirmation, then implement

### No Spaghetti

- Respect module boundaries — do not import between modules in `apps/api`
- Do not import between `apps/` projects — use `packages/shared` for shared code
- No business logic in route handlers or UI components
- No database access outside of service layer in the API

### Architecture First

- Read the relevant `ARCHITECTURE.md` before writing any code
- Read the relevant `CONSTRAINTS.md` — do not violate constraints
- Read the relevant `RESPONSIBILITIES.md` — do not work outside project boundaries

---

## Technology Reference

| Concern | Technology |
| -------------------- | ----------------------------- |
| API framework | Fastify |
| ORM | Prisma |
| Validation | Zod |
| Auth | JWT + refresh tokens |
| Database | PostgreSQL + PostGIS |
| Cache / queues | Redis |
| Realtime | Socket.IO |
| Background jobs | BullMQ + Node Cron |
| Routing / ETA | GraphHopper (`:8989`, `bus` profile) |
| Web framework | Next.js App Router |
| UI components | shadcn/ui + Tailwind CSS |
| Maps | MapLibre GL JS / MapLibre React Native |
| Mobile | React Native |
| Notifications | Novu + Telegram + SMTP |
| Monitoring | Grafana + Prometheus + Loki + Pino |
| Infrastructure | Docker + Nginx + VPS |

**Not used:** Kubernetes, Kafka, RabbitMQ, ElasticSearch, GraphQL, Google Maps, Firebase, Microservices.

---

## Infrastructure Already Running

| Service | Port | Status |
| ----------- | ---- | ------ |
| GraphHopper | 8989 | Running — `bus`, `car`, `foot` profiles, Hyderabad dataset |
| OSRM | 5001 | Running — evaluated, NOT used in production (GraphHopper chosen) |

---

## Git Rules

- Branch: `feature/GOV-{ID}-description` or `fix/GOV-{ID}-description`
- Commit: `feat(scope): GOV-{ID} short description`
- Never commit to `main` directly
- One ticket = one branch = one PR

---

## When You Are Unsure

- Read the relevant `ARCHITECTURE.md` and `CONSTRAINTS.md` first
- If still unsure, state your uncertainty and propose two options — do not guess and implement
- If a task requires touching more than one project, decompose it into per-project tickets

---

## Definition of Done

A task is complete only when:
- Code implemented and working
- Tests written and passing
- Documentation updated if behavior changed
- PR is reviewable (< 400 lines, single concern)
