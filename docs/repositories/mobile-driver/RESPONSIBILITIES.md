# Mobile Driver Responsibilities — `apps/mobile-driver`

---

## Owns

### Authentication
- Driver login, JWT token management, session restore on app launch
- Encrypted local token storage (MMKV)

### Trip Execution
- View today's assigned trips (morning and evening)
- Start trip: begins GPS broadcasting, notifies API that trip is active
- Navigate stop-by-stop: show upcoming stop with student count and names
- Complete trip: marks trip as done, stops GPS broadcasting

### Attendance Recording
All four attendance stages are owned exclusively by this app:

| Stage | Action |
|---|---|
| Pickup | Mark each student at each stop: Boarded / Absent / Not Present / Leave Approved |
| School Arrival | Mark all boarded students as arrived at school |
| Return Boarding | Mark each student at school: Boarded Return Trip / Not Boarding |
| Home Drop | Mark each student at their drop stop: Dropped |

### GPS Broadcasting
- Continuous location broadcasting during active trips (every 5 seconds)
- Background location: continues broadcasting when app is backgrounded
- Permission management: request foreground and background location at setup

### Offline Queue
- Queue all attendance actions when offline
- Queue GPS locations when offline
- Auto-sync all queued data when connectivity returns
- Never lose an attendance record due to network failure

### Incident Reporting
- Report: Delay, Breakdown, Accident, Route Issue
- Capture location, description, and optional photos
- Incidents can be started immediately and completed later (non-blocking)

---

## Does NOT Own

- Business logic — that is `apps/api`
- ETA calculation — that is `apps/api` + GraphHopper
- Notification sending to parents — that is `apps/api` + Novu
- Parent-facing tracking — that is `apps/mobile-parent`
- Admin / management functionality — that is `apps/web`
- Route creation or fleet management — that is `apps/web`
- Shared types and schemas — those live in `apps/shared`

---

## Boundary Rules

- Must never import from `apps/mobile-parent`, `apps/api`, or `apps/web`
- Must never access PostgreSQL, Redis, or GraphHopper directly
- All backend communication exclusively via REST API and Socket.IO
- Must not replicate API business logic locally — validate only for UX, not for correctness
- Offline queue must be durable: queued actions survive app restarts (use MMKV, not memory)
