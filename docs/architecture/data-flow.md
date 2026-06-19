# Data Flow

## 1. Driver Location Update Flow

```
Driver App (React Native)
  │
  │  POST /api/tracking/location
  │  { busId, lat, lng, heading, speed }
  │  (JWT auth header)
  ▼
Fastify API — Tracking Module
  ├──▶ Validate with Zod schema
  ├──▶ Verify driver owns the bus for active trip
  │
  ├──▶ Redis HSET bus:{busId}
  │         { lat, lng, heading, speed, updatedAt }
  │         (TTL: 5 minutes — stale detection)
  │
  ├──▶ BullMQ: enqueue location-persist job
  │         (async write to PostgreSQL location_history)
  │
  └──▶ Socket.IO emit("bus:location") to room trip:{tripId}
            { busId, lat, lng, heading, speed, updatedAt }
```

## 2. Parent Live Tracking Flow

```
Parent App (React Native)
  │
  │  CONNECT socket.io (JWT handshake)
  │  EMIT join-trip { tripId }
  ▼
Socket.IO Server (Fastify)
  ├──▶ Verify parent has a student on this trip
  ├──▶ JOIN room trip:{tripId}
  ├──▶ EMIT current-state
  │         { busLocation: Redis.HGETALL bus:{busId},
  │           eta: Redis.GET eta:{tripId}:{stopId} }
  │
  └──▶ RECEIVE bus:location events as driver moves
            │
            └──▶ Map updates in real time (MapLibre GL JS)
```

## 3. ETA Recalculation Flow (Background)

```
BullMQ Worker — eta-recalculate (every 30s per active trip)
  │
  ├──▶ Redis HGETALL bus:{busId}
  │         (get current location)
  │
  ├──▶ PostgreSQL: get remaining stops for trip
  │
  ├──▶ GraphHopper GET /route
  │         profile=bus
  │         from=current_position
  │         to=[stop1, stop2, stop3, ...]
  │
  ├──▶ Parse durations per leg → ETA timestamps
  │
  ├──▶ Redis SET eta:{tripId}:{stopId} → timestamp
  │
  └──▶ Socket.IO emit("eta:updated") to room trip:{tripId}
            { stopId, eta, delayMinutes }
```

## 4. Student Boarding Flow

```
Driver App
  │
  │  POST /api/trips/{tripId}/stops/{stopId}/board
  │  { studentId, status: "boarded" | "absent" }
  ▼
Fastify API — Trips Module
  ├──▶ Update TripStop.boardingStatus in PostgreSQL
  ├──▶ BullMQ: enqueue notification-dispatch job
  │
  └──▶ Notification Worker
            ├──▶ Novu: push notification to parent
            └──▶ Event: "student_boarded" { studentName, stopName, time }
```

## 5. Trip Lifecycle

```
Node Cron (5:00 AM daily)
  └──▶ Create Trip records for all scheduled routes
         Status: SCHEDULED

Driver starts trip (mobile)
  └──▶ PATCH /api/trips/{tripId}/start
         Status: ACTIVE
         ├── Start eta-recalculate BullMQ repeatable job
         └── Socket.IO emit school:{schoolId} → trip:started

Driver completes trip (all stops done)
  └──▶ PATCH /api/trips/{tripId}/complete
         Status: COMPLETED
         ├── Stop eta-recalculate job
         └── Socket.IO emit school:{schoolId} → trip:completed

Node Cron (10:00 PM daily)
  └──▶ Auto-close any ACTIVE trips still open
         Status: FORCE_CLOSED
```

## 6. Route Creation Flow (Admin)

```
Admin Web (Next.js)
  │
  │  POST /api/routes
  │  { name, busId, stops: [{ lat, lng, name, sequence }] }
  ▼
Fastify API — Routes Module
  ├──▶ Validate stops geometry with PostGIS
  ├──▶ Call GraphHopper Route Optimization API
  │         to get optimal stop sequence
  ├──▶ Store Route with PostGIS LineString geometry
  ├──▶ Store Stops as PostGIS Points
  └──▶ Return route with polyline for map display
```

## 7. Authentication Flow

```
Login
  │  POST /api/auth/login { email, password }
  ▼
  ├──▶ Validate credentials (bcrypt)
  ├──▶ Issue access token (JWT, 15min)
  ├──▶ Issue refresh token (opaque, 30 days, stored in PostgreSQL)
  └──▶ Return { accessToken, refreshToken }

Refresh
  │  POST /api/auth/refresh { refreshToken }
  ▼
  ├──▶ Validate refresh token in PostgreSQL
  ├──▶ Rotate: invalidate old, issue new refresh token
  └──▶ Return { accessToken, refreshToken }

Logout
  │  POST /api/auth/logout { refreshToken }
  ▼
  └──▶ Delete refresh token from PostgreSQL
```
