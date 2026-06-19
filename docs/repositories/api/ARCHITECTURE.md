# API Architecture — `apps/api`

## Style

Modular Monolith. One deployable process. Modules are internally isolated — they communicate through service calls, not HTTP or events.

---

## Folder Structure

```
apps/api/src/
│
├── modules/
│   ├── auth/
│   │   ├── auth.plugin.ts        # Fastify plugin registration
│   │   ├── auth.routes.ts        # Route definitions
│   │   ├── auth.service.ts       # Business logic
│   │   ├── auth.schema.ts        # Zod + JSON schemas
│   │   └── auth.test.ts
│   │
│   ├── users/
│   ├── schools/
│   ├── buses/
│   ├── routes/
│   ├── stops/
│   ├── students/
│   ├── trips/
│   ├── tracking/
│   ├── routing/                  # GraphHopper client
│   ├── notifications/
│   └── background/               # BullMQ workers + Node Cron
│
├── plugins/
│   ├── prisma.ts                 # Prisma client plugin
│   ├── redis.ts                  # Redis client plugin
│   ├── socket.ts                 # Socket.IO plugin
│   ├── bullmq.ts                 # BullMQ plugin
│   ├── auth-hook.ts              # JWT preHandler hook
│   └── swagger.ts                # OpenAPI docs plugin
│
├── utils/
│   ├── errors.ts                 # Custom error classes
│   ├── response.ts               # Standard response shapes
│   └── postgis.ts                # PostGIS raw query helpers
│
├── config.ts                     # Env vars parsed with Zod
└── app.ts                        # Fastify app factory
```

---

## Module Structure

Each module follows the same pattern:

```
module/
  module.plugin.ts      # Registers routes, hooks, dependencies
  module.routes.ts      # Route handlers (thin — delegate to service)
  module.service.ts     # Business logic (pure — testable)
  module.schema.ts      # Zod schemas + JSON Schema for Fastify
  module.test.ts        # Tests
```

Route handlers must be thin. All logic lives in the service.

```typescript
// routes.ts — thin handler
fastify.post("/trips/:tripId/start", {
  preHandler: [authenticate, authorize(UserRole.DRIVER)],
  schema: startTripSchema,
}, async (req, reply) => {
  const trip = await tripService.startTrip(req.params.tripId, req.user.id);
  return reply.code(200).send({ data: trip });
});

// service.ts — all logic here
async function startTrip(tripId: string, driverId: string): Promise<Trip> {
  // validate, transition state, trigger side effects
}
```

---

## Plugin Load Order

```
config → prisma → redis → bullmq → socket.io → modules → swagger
```

Each plugin decorates the Fastify instance (`fastify.prisma`, `fastify.redis`, etc.) and is available to all modules registered after it.

---

## Authentication Flow

```
Request → JWT preHandler hook
  ├── Valid token → decorate req.user → continue
  └── Invalid/expired → 401 Unauthorized
```

Authorization is checked per route:

```typescript
preHandler: [authenticate, authorize(UserRole.SCHOOL_ADMIN)]
```

---

## Error Handling

Centralized in Fastify's `setErrorHandler`. All thrown errors map to structured JSON responses.

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) { super(message); }
}

// Usage in service
throw new AppError(404, "TRIP_NOT_FOUND", "Trip does not exist");

// Response
{ "error": { "code": "TRIP_NOT_FOUND", "message": "Trip does not exist" } }
```

---

## Background Jobs

BullMQ workers run **in the same process** as the API. No separate worker process.

```
app.ts
  └── registers bullmq plugin
        └── starts workers:
              ├── EtaRecalculateWorker
              ├── LocationPersistWorker
              └── NotificationDispatchWorker

Node Cron (in background plugin):
  ├── 5:00am → TripAutoCreateJob
  └── 10:00pm → TripAutoCloseJob
```

---

## GraphHopper Integration

All GraphHopper calls are in `modules/routing/`:

```
routing/
  graphhopper.client.ts   # HTTP client wrapping GraphHopper REST API
  routing.service.ts      # ETA calculation, deviation detection, optimization
  routing.plugin.ts       # Registers as Fastify plugin
```

GraphHopper is called:
- On route creation (stop sequence optimization)
- By ETA recalculation BullMQ worker (every 30s per active trip)
- Never directly from a request handler (too slow for inline)
