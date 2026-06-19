# Govexa — Documentation Index

> Start here. Every contributor and AI agent must read this file first.

---

## Quick Reference

| I want to...                        | Go to                                              |
| ----------------------------------- | -------------------------------------------------- |
| Understand the product              | [Product Design Document](product/PRODUCT.md)      |
| Understand the system               | [Architecture Overview](architecture/system-overview.md) |
| Start a new feature                 | [AI Workflow Rules](workflows/AI_WORKFLOW_RULES.md) |
| Start a ticket (AI skill)           | `/ticket GOV-{ID} {scope} {description}`           |
| Scaffold an API module (AI skill)   | `/new-module {name} GOV-{ID}`                      |
| Scaffold a web page (AI skill)      | `/new-page {section/page} GOV-{ID}`                |
| Check changes for rule violations   | `/check`                                           |
| Load trip lifecycle context         | `/trip-context`                                    |
| Reference student status states     | `/student-status`                                  |
| Understand git/branch rules         | [Git Workflow](workflows/git-workflow.md)          |
| Review a PR                         | [Code Review](workflows/code-review.md)            |
| Understand why X was chosen         | [ADR Index](#architecture-decisions)               |
| Work on the API                     | [API Repo Docs](repositories/api/README.md)        |
| Work on the Web app                 | [Web Repo Docs](repositories/web/README.md)        |
| Work on the Driver app              | [Mobile Driver Docs](repositories/mobile-driver/README.md) |
| Work on the Parent app              | [Mobile Parent Docs](repositories/mobile-parent/README.md) |
| Work on shared packages             | [Shared Repo Docs](repositories/shared/README.md)  |
| Set up monitoring                   | [Monitoring](operations/monitoring.md)             |
| Handle an incident                  | [Incident Response](operations/incident-response.md) |

---

## Documentation Structure

```
docs/
│
├── README.md                          ← You are here
│
├── product/
│   └── PRODUCT.md                     ← Product goals, vision, user roles, flows (read first)
│
├── architecture/
│   ├── system-overview.md             ← High-level system design
│   ├── data-flow.md                   ← How data moves through the system
│   └── deployment.md                  ← VPS + Docker deployment layout
│
├── adr/
│   ├── ADR-001-monorepo.md            ← Why monorepo with pnpm workspaces
│   ├── ADR-002-fastify.md             ← Why Fastify over Express/NestJS
│   ├── ADR-003-postgresql-postgis.md  ← Why PostgreSQL + PostGIS
│   ├── ADR-004-graphhopper.md         ← Why GraphHopper over OSRM/Google Maps
│   └── ADR-005-realtime.md            ← Why Socket.IO + Redis
│
├── workflows/
│   ├── AI_WORKFLOW_RULES.md           ← Mandatory AI agent rules
│   ├── git-workflow.md                ← Branch, commit, PR rules
│   ├── release-process.md             ← How releases are made
│   └── code-review.md                 ← Review checklist
│
├── repositories/
│   ├── api/                           ← Backend API repo docs
│   │   ├── README.md
│   │   ├── ARCHITECTURE.md
│   │   ├── RULES.md
│   │   ├── CONSTRAINTS.md
│   │   ├── RESPONSIBILITIES.md
│   │   └── DESIGN_PRINCIPLES.md       ← Why and how decisions are made in this repo
│   ├── web/                           ← Next.js web app repo docs
│   │   ├── README.md
│   │   ├── ARCHITECTURE.md
│   │   ├── RULES.md
│   │   ├── CONSTRAINTS.md
│   │   ├── RESPONSIBILITIES.md
│   │   └── DESIGN_PRINCIPLES.md
│   ├── mobile-driver/                 ← Driver app repo docs
│   │   ├── README.md
│   │   ├── ARCHITECTURE.md
│   │   ├── RULES.md
│   │   ├── CONSTRAINTS.md
│   │   ├── RESPONSIBILITIES.md
│   │   └── DESIGN_PRINCIPLES.md
│   ├── mobile-parent/                 ← Parent app repo docs
│   │   ├── README.md
│   │   ├── ARCHITECTURE.md
│   │   ├── RULES.md
│   │   ├── CONSTRAINTS.md
│   │   ├── RESPONSIBILITIES.md
│   │   └── DESIGN_PRINCIPLES.md
│   └── shared/                        ← Shared packages repo docs
│       ├── README.md
│       ├── ARCHITECTURE.md
│       ├── RULES.md
│       ├── CONSTRAINTS.md
│       ├── RESPONSIBILITIES.md
│       └── DESIGN_PRINCIPLES.md
│
├── standards/
│   ├── typescript.md                  ← TypeScript conventions
│   ├── naming.md                      ← Naming conventions across all projects
│   ├── testing.md                     ← Testing requirements and patterns
│   └── security.md                    ← Security standards
│
└── operations/
    ├── monitoring.md                  ← Grafana, Prometheus, Loki setup
    ├── backups.md                     ← Database backup strategy
    └── incident-response.md           ← On-call and incident playbook
```

---

## Architecture Decisions

| ADR | Decision | Status |
| --- | -------- | ------ |
| [ADR-001](adr/ADR-001-monorepo.md) | pnpm monorepo with workspaces | Accepted |
| [ADR-002](adr/ADR-002-fastify.md) | Fastify as API framework | Accepted |
| [ADR-003](adr/ADR-003-postgresql-postgis.md) | PostgreSQL + PostGIS as primary database | Accepted |
| [ADR-004](adr/ADR-004-graphhopper.md) | GraphHopper as routing engine | Accepted |
| [ADR-005](adr/ADR-005-realtime.md) | Socket.IO + Redis for realtime | Accepted |

---

## Project Repositories

| Repo | Path | Purpose |
| ---- | ---- | ------- |
| API | `apps/api` | Fastify backend — all business logic |
| Web | `apps/web` | Next.js admin and school portal |
| Mobile Driver | `apps/mobile-driver` | React Native driver app |
| Mobile Parent | `apps/mobile-parent` | React Native parent app |
| Shared | `packages/shared` | Types, Zod schemas, constants |

---

## Mandatory Reading Order

1. This file (`docs/README.md`)
2. [Product Design Document](product/PRODUCT.md)
3. [AI Workflow Rules](workflows/AI_WORKFLOW_RULES.md)
4. [Architecture Overview](architecture/system-overview.md)
5. The relevant repository docs under `repositories/`

No implementation should begin without completing steps 1–5.
