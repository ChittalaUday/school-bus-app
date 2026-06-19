# Naming Conventions

Applies to all projects in the monorepo.

---

## General Rules

- Names must be descriptive — no single-letter variables except loop counters
- No abbreviations unless universally known (`id`, `url`, `eta`, `lat`, `lng`)
- No generic names: `data`, `info`, `obj`, `temp`, `stuff`, `thing`

---

## Files and Folders

| Item | Convention | Example |
| -------------------- | ---------- | ----------------------- |
| Source files | kebab-case | `trip-service.ts` |
| Test files | same + `.test` | `trip-service.test.ts` |
| Type declaration files | same + `.types` | `trip.types.ts` |
| Folders | kebab-case | `background-jobs/` |
| React components | PascalCase | `TripCard.tsx` |
| React component folders | PascalCase | `TripCard/` |

---

## TypeScript

| Item | Convention | Example |
| ------------------- | ----------- | ---------------------------------- |
| Variables | camelCase | `activeTrips` |
| Functions | camelCase | `calculateEta` |
| Classes | PascalCase | `GraphHopperClient` |
| Interfaces | PascalCase | `TripWithStops` |
| Types | PascalCase | `TripStatus` |
| Enums / const maps | PascalCase | `UserRole` |
| Constants | SCREAMING_SNAKE | `MAX_ETA_RETRY_COUNT` |
| Zod schemas | camelCase + `Schema` | `locationUpdateSchema` |
| Fastify plugins | camelCase + `Plugin` | `redisPlugin` |

---

## Database (Prisma)

| Item | Convention | Example |
| --------------- | ----------- | --------------- |
| Models | PascalCase | `Trip`, `TripStop` |
| Fields | camelCase | `scheduledEta` |
| Table names | snake_case (auto) | `trip_stop` |
| Column names | snake_case (auto) | `scheduled_eta` |
| Relations | camelCase | `trip.stops` |

---

## API Routes

RESTful, lowercase, hyphen-separated:

```
POST   /api/auth/login
POST   /api/auth/refresh
DELETE /api/auth/logout

GET    /api/schools
POST   /api/schools
GET    /api/schools/:schoolId
PATCH  /api/schools/:schoolId

GET    /api/routes
POST   /api/routes
GET    /api/routes/:routeId
PATCH  /api/routes/:routeId
DELETE /api/routes/:routeId

GET    /api/trips
POST   /api/trips
GET    /api/trips/:tripId
PATCH  /api/trips/:tripId/start
PATCH  /api/trips/:tripId/complete

POST   /api/tracking/location
GET    /api/tracking/buses/:busId
```

---

## Socket.IO Events

Format: `noun:verb` in lowercase with colon separator.

```
bus:location          → driver location update
bus:status            → bus online/offline status
eta:updated           → ETA recalculated for a stop
trip:started          → trip began
trip:completed        → trip ended
student:boarded       → student marked as boarded
student:absent        → student marked as absent
```

---

## Linear Tickets

Format: `GOV-{number}` — automatically assigned by Linear.

Branch names reference the ticket:

```
feature/GOV-101-auth-jwt
fix/GOV-203-eta-deviation
```

---

## Environment Variables

SCREAMING_SNAKE_CASE with service prefix:

```
DATABASE_URL
REDIS_URL
JWT_SECRET
JWT_REFRESH_SECRET
GRAPHHOPPER_URL
AWS_S3_BUCKET
AWS_ACCESS_KEY_ID
NOVU_API_KEY
TELEGRAM_BOT_TOKEN
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
```
