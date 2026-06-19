# System Overview — Govexa

## What Is Govexa

Govexa is a school bus tracking and management platform for Hyderabad. It enables schools to manage bus routes, drivers, and students, and allows parents to track their child's bus in real time.

---

## System Style

**Modular Monolith** — one deployable API, organized into independent modules that each own their domain. Not microservices. No service-to-service network calls.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            VPS (Single)                             │
│                                                                     │
│  ┌──────────┐    ┌──────────────────────────────────────────────┐  │
│  │  Nginx   │───▶│              Fastify API (apps/api)           │  │
│  │ (proxy)  │    │                                              │  │
│  └──────────┘    │  ┌─────────┐ ┌─────────┐ ┌──────────────┐  │  │
│       │          │  │  Auth   │ │ Routes  │ │   Tracking   │  │  │
│       │          │  ├─────────┤ ├─────────┤ ├──────────────┤  │  │
│       │          │  │ Users   │ │  Buses  │ │   Routing    │  │  │
│       │          │  ├─────────┤ ├─────────┤ ├──────────────┤  │  │
│       │          │  │ Schools │ │ Students│ │ Notifications│  │  │
│       │          │  ├─────────┤ ├─────────┤ ├──────────────┤  │  │
│       │          │  │  Trips  │ │  Stops  │ │  Background  │  │  │
│       │          │  └─────────┘ └─────────┘ └──────────────┘  │  │
│       │          └──────────────────────────────────────────────┘  │
│       │                    │              │                         │
│       │              ┌─────▼────┐   ┌────▼──────┐                 │
│       │              │PostgreSQL│   │   Redis    │                 │
│       │              │ +PostGIS │   │(locations +│                 │
│       │              └──────────┘   │   cache)   │                 │
│       │                             └────────────┘                 │
│       │                                                             │
│       ├──▶ Next.js Web (apps/web) :3001                            │
│       │                                                             │
│       └──▶ GraphHopper (internal) :8989                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

External:
  Mobile Driver (React Native) ──▶ Nginx ──▶ API (REST + Socket.IO)
  Mobile Parent (React Native) ──▶ Nginx ──▶ API (REST + Socket.IO)
```

---

## Component Responsibilities

### Nginx
- SSL termination
- Reverse proxy to API and Web
- WebSocket upgrade passthrough for Socket.IO

### Fastify API (`apps/api`)
- All business logic
- REST API
- Socket.IO server (realtime)
- BullMQ workers (background jobs)
- GraphHopper client (routing, ETA)

### PostgreSQL + PostGIS
- All persistent data
- Historical bus locations (PostGIS Point)
- Route geometries (PostGIS LineString)
- Geospatial queries (stop proximity, geofences)

### Redis
- Current bus location (HSET per bus — fast read for realtime)
- BullMQ queue backend
- Socket.IO adapter (for horizontal scaling if needed later)

### GraphHopper (`:8989`)
- Route calculation between stops using `bus` profile
- ETA calculation from current position
- Route optimization (stop sequencing)
- Hyderabad OSM data only

### Next.js Web (`apps/web`)
- Admin portal (route management, fleet, students)
- School portal (roster, trip monitoring)
- Live tracking map (MapLibre GL JS)
- No direct database access — calls API only

### React Native Driver App (`apps/mobile-driver`)
- GPS broadcasting, turn-by-turn navigation, boarding confirmation
- No direct database access — calls API only

### React Native Parent App (`apps/mobile-parent`)
- Live bus tracking, ETA, push notifications
- No direct database access — calls API only

### `packages/shared`
- TypeScript types shared across API, Web, Mobile
- Zod schemas for shared validation
- Constants (route status, user roles, etc.)

---

## Roles

| Role | Platform | Capabilities |
| ------------ | -------- | -------------------------------------------- |
| Super Admin | Web | Manage all schools, system config |
| School Admin | Web | Manage school's routes, buses, students |
| Driver | Mobile | Broadcast location, manage boarding |
| Parent | Mobile | Track bus, receive notifications |

---

## Technology Decisions

See ADRs in `docs/adr/` for the rationale behind each choice.

| Concern | Technology | ADR |
| ------------------- | ----------- | ----------------------------------------- |
| Monorepo | pnpm workspaces | [ADR-001](../adr/ADR-001-monorepo.md) |
| API framework | Fastify | [ADR-002](../adr/ADR-002-fastify.md) |
| Database | PostgreSQL + PostGIS | [ADR-003](../adr/ADR-003-postgresql-postgis.md) |
| Routing | GraphHopper | [ADR-004](../adr/ADR-004-graphhopper.md) |
| Realtime | Socket.IO + Redis | [ADR-005](../adr/ADR-005-realtime.md) |
