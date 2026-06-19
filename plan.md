# Govexa — Build Plan

## Current State

| Service      | Port | Status                                                              |
| ------------ | ---- | ------------------------------------------------------------------- |
| GraphHopper  | 8989 | Done — `car`, `bus`, `foot` profiles + Hyderabad graph cache built  |
| OSRM         | 5001 | Done — MLD algorithm, Hyderabad preprocessed                        |

> **Routing decision**: arch.md specifies **GraphHopper** as the primary routing engine.
> OSRM was evaluated for comparison. Going forward, GraphHopper (`bus` profile) is used for all routing.

---

## Monorepo Structure

```
govexa/
├── apps/
│   ├── api/          # Fastify backend
│   ├── web/          # Next.js frontend
│   └── mobile/       # React Native app
├── packages/
│   └── shared/       # Shared types, Zod schemas, utils
├── docker-compose.yml
├── .env.example
└── pnpm-workspace.yaml
```

---

## Phase 1 — Project Foundation

- [ ] Init pnpm monorepo with workspaces
- [ ] Root `docker-compose.yml` wiring all services:
  - PostgreSQL + PostGIS
  - Redis
  - GraphHopper (existing)
  - Nginx
- [ ] Zod-validated `.env` schema loaded at API startup
- [ ] Shared `packages/shared` — types, Zod schemas, constants

---

## Phase 2 — Database Schema (PostgreSQL + PostGIS + Prisma)

### Entities

```
School
  └── Routes
        └── Stops         (PostGIS Point — lat/lng)
  └── Buses
        └── Drivers        (User with role: driver)
  └── Students
        └── Parents        (User with role: parent)

Trips
  └── TripStops            (sequence, scheduled_eta, actual_eta, actual_time)

LocationHistory            (bus_id, PostGIS Point, timestamp) → PostgreSQL
CurrentLocation            (bus_id → Redis HSET only)
```

### Tasks
- [ ] Prisma schema with all models
- [ ] PostGIS extension setup in migration
- [ ] Seed script — demo school, routes, stops, users
- [ ] Index: `location_history(bus_id, timestamp)`, `stops(coordinates)` GIST index

---

## Phase 3 — Backend API (Fastify + TypeScript)

### Module structure

```
apps/api/src/
  modules/
    auth/           # JWT + refresh token rotation
    users/          # Admin, SchoolAdmin, Driver, Parent roles
    schools/
    students/
    buses/
    routes/         # Route + ordered stop management
    trips/          # Trip lifecycle: scheduled → active → completed
    tracking/       # Driver GPS ingestion
    routing/        # GraphHopper proxy — ETA, directions, optimization
    notifications/
  plugins/
    prisma.ts
    redis.ts
    socket.ts
    bullmq.ts
  utils/
    errors.ts
    response.ts
```

### Build order

- [ ] Fastify app skeleton — plugins, error handler, Swagger/OpenAPI
- [ ] **Auth module** — register, login, refresh, logout (JWT + refresh token rotation)
- [ ] **Users module** — CRUD + RBAC (role-based access via Fastify preHandler hooks)
- [ ] **Schools module**
- [ ] **Buses module** — vehicle fleet registry
- [ ] **Routes module** — route + stop sequencing (PostGIS LineString stored)
- [ ] **Students module** — enrollment, parent linking, route assignment
- [ ] **Trips module** — daily trip creation, status transitions, stop progression
- [ ] **Tracking module** — driver POSTs GPS → Redis + async PostgreSQL write
- [ ] **Routing module** — GraphHopper integration (see Phase 4)

---

## Phase 4 — GraphHopper Routing Integration

GraphHopper running at `http://localhost:8989` with `bus` profile.

### Features to implement

| Feature              | GraphHopper API                        | Usage                                      |
| -------------------- | -------------------------------------- | ------------------------------------------ |
| Route between stops  | `GET /route` with `bus` profile        | Build route polyline for admin map         |
| Stop sequence optimization | Route Optimization API           | Reorder stops for shortest trip            |
| Live ETA per stop    | `GET /route` from current bus position | Recalculate every 30s per active trip      |
| Rerouting            | Detect deviation → new `GET /route`    | Push updated ETA via Socket.IO             |
| Isochrone            | `GET /isochrone`                       | Show pickup radius zones in admin          |

### Tasks

- [ ] GraphHopper service wrapper (`apps/api/src/modules/routing/graphhopper.ts`)
- [ ] ETA calculation from current bus position to all remaining stops
- [ ] Deviation detection (compare actual path vs planned route)
- [ ] Route optimization on route creation

---

## Phase 5 — Realtime Tracking (Socket.IO + Redis)

### Data flow

```
Driver App
  └── POST /tracking/location
        ├── Redis HSET bus:{id} { lat, lng, heading, speed, updated_at }
        ├── PostgreSQL location_history (async via BullMQ job)
        └── Socket.IO emit("bus:location") to room trip:{tripId}

Parent App
  └── CONNECT socket
  └── JOIN room trip:{tripId}
  └── RECEIVE bus:location + eta:updated events
```

### Socket.IO rooms

| Room             | Members               | Events                            |
| ---------------- | --------------------- | --------------------------------- |
| `trip:{id}`      | Parents on that trip  | `bus:location`, `eta:updated`     |
| `bus:{id}`       | School admins         | `bus:location`, `status:changed`  |
| `school:{id}`    | School admin          | `trip:started`, `trip:completed`  |

### Tasks

- [ ] Socket.IO plugin in Fastify
- [ ] Auth middleware for socket connections (JWT verify on handshake)
- [ ] Location ingestion endpoint + Redis write
- [ ] Room join/leave logic
- [ ] Emit pipeline from tracking → socket

---

## Phase 6 — Background Jobs (BullMQ + Node Cron)

| Job                    | Trigger              | Action                                                  |
| ---------------------- | -------------------- | ------------------------------------------------------- |
| `eta-recalculate`      | Every 30s per active trip | GraphHopper ETA → emit `eta:updated` via Socket.IO |
| `location-persist`     | Queue consumer       | Write Redis location snapshots to PostgreSQL            |
| `trip-auto-create`     | Cron 5:00am daily    | Create trips for all scheduled routes                   |
| `trip-auto-close`      | Cron 10:00pm daily   | Close any lingering active trips                        |
| `notification-dispatch`| Queue consumer       | Send Novu / Telegram / SMTP notifications               |

### Tasks

- [ ] BullMQ plugin setup with Redis connection
- [ ] ETA recalculation worker
- [ ] Location persistence worker
- [ ] Node Cron scheduled jobs
- [ ] Notification dispatch worker

---

## Phase 7 — Notifications (Novu + Telegram + SMTP)

| Event                    | Channel                        |
| ------------------------ | ------------------------------ |
| Bus 10 min from stop     | Push (Novu) + SMS              |
| Student boarded/alighted | Push to parent                 |
| Trip started / ended     | Push to parent                 |
| Delay > 5 min            | Push + Telegram (ops team)     |
| Driver SOS               | Telegram (ops) + Email (admin) |

### Tasks

- [ ] Novu workflow setup (templates for each event type)
- [ ] Telegram bot integration (ops alerts)
- [ ] SMTP setup (admin emails)
- [ ] Notification module in API — event emitter pattern feeding the dispatch queue

---

## Phase 8 — File Storage (S3 Compatible)

- [ ] S3 client wrapper (aws-sdk v3)
- [ ] Student photo upload endpoint
- [ ] Driver license / document upload
- [ ] Presigned URL generation for frontend direct upload

---

## Phase 9 — Frontend Web (Next.js + MapLibre + shadcn/ui)

### Pages

| Route              | Role         | Description                                      |
| ------------------ | ------------ | ------------------------------------------------ |
| `/`                | Public       | Login                                            |
| `/dashboard`       | Admin/School | Overview stats — active trips, buses, alerts     |
| `/routes`          | Admin        | Create/edit routes + stop sequencing on map      |
| `/buses`           | Admin        | Fleet management                                 |
| `/students`        | School Admin | Student roster, route assignment                 |
| `/trips`           | Admin        | Today's trips, live status board                 |
| `/track/[tripId]`  | Admin/Parent | Live map — bus position + ETA per stop           |
| `/reports`         | Admin        | Historical trip reports                          |

### Map features (MapLibre GL JS + OpenStreetMap tiles)

- Live bus marker (updates via Socket.IO)
- Route polyline from GraphHopper
- Stop markers with ETA popup
- Geofence circles around stops

### Tasks

- [ ] Next.js app setup with Tailwind + shadcn/ui
- [ ] Auth flow — login, JWT storage, refresh handling (Zustand)
- [ ] MapLibre integration with OSM tiles
- [ ] Live tracking page — Socket.IO client + map updates
- [ ] Route builder — drag-and-drop stop sequencing on map
- [ ] Admin dashboard
- [ ] Student management CRUD
- [ ] Reports page

---

## Phase 10 — Mobile App (React Native)

### Driver App

- [ ] Login → view assigned trips
- [ ] Start trip → begin background GPS broadcasting
- [ ] Turn-by-turn directions (GraphHopper directions API)
- [ ] Mark student boarded / absent at each stop
- [ ] SOS button → triggers emergency notification

### Parent App

- [ ] Login → child's bus live position on map (MapLibre React Native)
- [ ] ETA to their child's stop
- [ ] Push notification opt-in (Novu mobile)
- [ ] Trip history

---

## Phase 11 — Monitoring (Grafana + Prometheus + Loki + Pino)

- [ ] Pino structured logs → Loki (via Promtail Docker plugin)
- [ ] Prometheus metrics endpoint in Fastify (`/metrics`)
  - API request latency + error rate
  - Active trips count
  - Socket.IO connection count
  - BullMQ queue depth
  - GraphHopper request latency
- [ ] Grafana dashboards:
  - Ops overview (active buses, trips, alerts)
  - Trip health (ETA accuracy, delays)
  - System health (CPU, memory, queue depth)

---

## Phase 12 — Infrastructure (Docker + Nginx + GitHub Actions)

### VPS layout

```
Nginx (443/80 → internal ports)
├── api.govexa.com    → API :3000
├── app.govexa.com    → Web :3001
├── grafana.govexa.com → Grafana :3100 (admin-only)
└── [GraphHopper, PostgreSQL, Redis — internal only]
```

### Tasks

- [ ] Production `docker-compose.yml` with health checks
- [ ] Nginx config — SSL termination, upstream proxy, WebSocket support
- [ ] GitHub Actions workflow:
  - `test` → `build` → `push Docker image` → `SSH deploy`
- [ ] `.env` secrets management (GitHub Actions secrets → VPS)
- [ ] Database backup cron (pg_dump → S3)

---

## Build Order Summary

```
Phase 1  →  Foundation + monorepo + docker-compose
Phase 2  →  Database schema + Prisma + seed
Phase 3  →  Auth + Users + RBAC (API)
Phase 4  →  Schools + Routes + Stops + Buses (API)
Phase 5  →  Trips + Tracking + GraphHopper ETA (API)
Phase 6  →  Socket.IO realtime tracking
Phase 7  →  BullMQ background jobs
Phase 8  →  Notifications
Phase 9  →  Web frontend
Phase 10 →  Mobile app
Phase 11 →  Monitoring
Phase 12 →  CI/CD + production infra
```
