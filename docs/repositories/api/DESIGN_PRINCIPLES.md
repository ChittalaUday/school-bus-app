# API Design Principles — `apps/api`

These principles guide every decision made in the API. Rules tell you what is forbidden; principles tell you why and how to think.

---

## 1. Services Are the Truth — Not Routes

Route handlers are post offices. They receive a package (request), validate the label (schema), and hand it off. All decisions — validation logic, state transitions, side effects — live in the service.

If you find yourself writing an `if` statement in a route handler, it belongs in the service.

---

## 2. Async First, Always

The API runs on a single VPS. A slow synchronous operation (GraphHopper call, Novu dispatch, S3 upload) inside a request handler stalls the event loop and affects every concurrent request.

**Rule of thumb:** if an operation talks to anything outside the Node.js process, it goes through BullMQ — never inline.

The only exception is Prisma (database) and Redis reads that are fast by design.

---

## 3. Fail Loudly, Fail Structured

Silent failures are the enemy of accountability in a student safety platform.

- Never catch an error and continue silently
- Every caught error either rethrows or creates an `AppError` with a meaningful code
- Error codes are part of the API contract — pick them deliberately (`TRIP_NOT_FOUND`, `STUDENT_ALREADY_BOARDED`)
- Clients never see stack traces or internal Prisma errors

---

## 4. Module Isolation Is a Hard Boundary

The API is a modular monolith, not a spaghetti monolith. The value of the modularity is that each module can be reasoned about in isolation.

When module A needs something from module B, the solution is never a direct import. The solution is one of:
- Inject the dependency through the Fastify decorator
- Move shared logic to a shared utility
- Question whether the coupling is correct

Shared Fastify plugins (`prisma`, `redis`, `socket`) are the only legitimate cross-cutting concerns.

---

## 5. The Student Is the Anchor Entity

Every attendance record, trip event, and notification ultimately refers to a specific student. When designing a new service method, ask: "What student does this affect?" If the answer is unclear, the design is probably wrong.

API responses for trip/attendance data should always make the student identity obvious — never return raw IDs without including enough context for the client to display the student.

---

## 6. Socket.IO Events Are a Contract

Socket.IO events emitted by the API are consumed by the web portal and mobile apps. Changing an event name or payload shape breaks clients silently at runtime.

- Event names and payload shapes must be defined in `apps/shared`
- Never rename or reshape a socket event without updating all consumers

---

## 7. Location Data Is High Volume — Treat It That Way

Location updates arrive at up to 50/second at peak. This affects:

- The `POST /tracking/location` handler must be as thin as possible — validate, write to Redis, queue persistence job, done
- Never process location data synchronously in the request handler
- `location_history` rows are never read in real-time — they are for post-trip analytics only
- GPS coordinates stored as PostGIS `POINT` — never as two separate `lat`/`lng` float columns

---

## 8. Idempotency for Driver Operations

Drivers operate offline. When they reconnect, queued attendance actions may be replayed. Services must handle duplicate submissions gracefully — not throw an error if a student is marked "Boarded" twice.

Design attendance-writing operations to be idempotent: last-write-wins or detect-and-skip.

---

## 9. Notifications Are Side Effects — Not the Main Event

The notification (SMS, Telegram, email to parent) is a side effect of an attendance action, not the action itself. The attendance record is written first; the notification is dispatched asynchronously.

If the notification fails, the attendance record must still exist and be accurate. Never make attendance recording conditional on notification success.

---

## 10. Read the Constraints Before Optimizing

Before adding a cache, adding a new index, or changing a query, read `CONSTRAINTS.md`. The single-VPS deployment with a 512MB API container and 10 Prisma connections shapes every performance decision.
