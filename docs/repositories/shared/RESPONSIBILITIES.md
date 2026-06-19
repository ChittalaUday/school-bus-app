# Shared Responsibilities — `apps/shared`

---

## Owns

### Domain Entity Types
TypeScript types for all entities that cross application boundaries:
`Student`, `Parent`, `Driver`, `Bus`, `Route`, `Stop`, `Trip`, `TransportationAttendance`, `Incident`, `Institution`, `Campus`, `AcademicYear`

### API Contract Schemas (Zod)
- Request body schemas for all API endpoints
- Response payload schemas for all API endpoints
- Form validation schemas shared between web UI and API

### Status Enums and Display Labels
Every status enum ships with both the logic value and parent/UI-facing display strings:

- `StudentStatus` + display labels
- `TripStatus` + display labels
- `AttendanceStatus` (Boarded, Absent, Not Present, Leave Approved) + display labels
- `StudentTransportStatus` (Waiting For Pickup, Bus Approaching, On Bus, Arrived At School, Returning Home, Dropped Home, Absent, On Leave) + parent-facing display strings
- `IncidentType` + display labels
- `UserRole` (Super Admin, School Admin, Transportation Manager, Driver, Parent)

### Socket Event Definitions
Canonical socket event names and their payload types — shared by API (emitter) and web/mobile (listeners):
- `bus:location` payload
- `eta:updated` payload
- `attendance:recorded` payload
- `trip:status-changed` payload
- `incident:reported` payload

### Constants
- Error codes used in `AppError` responses
- Notification event type identifiers
- Business constants (GPS broadcast interval, attendance status options, proximity threshold for "bus approaching")

---

## Does NOT Own

- Business logic of any kind
- Database schema (owned by `apps/api` via Prisma)
- API route definitions or handlers
- UI components
- Platform-specific utilities (Node.js built-ins, React, React Native, Fastify)
- Prisma client or any ORM
- Any side effects — shared is purely declarative

---

## Boundary Rules

- Must import nothing from `apps/*`
- Must import nothing from Node.js built-ins (`fs`, `path`, `http`, `crypto`)
- Must import nothing from React, React Native, Next.js, Fastify, or any framework
- Consumed by all apps — breaking changes must update every consumer in the same PR
- Is the only place where type contracts between projects are defined
