# Mobile Responsibilities — `apps/mobile`

---

## Owns

- Driver experience: GPS broadcasting, trip management, student boarding confirmation, SOS
- Parent experience: live bus tracking, ETA display, push notification handling
- Device permission management (GPS, notifications)
- Background location broadcasting during active trips
- Local token storage (MMKV)
- Socket.IO client for live tracking

## Does NOT Own

- Business logic — that is `apps/api`
- ETA calculation — that is `apps/api` + GraphHopper
- Notification sending — that is `apps/api` + Novu
- Admin functionality — that is `apps/web`
- Route creation or management — that is `apps/web`
- Student/fleet management — that is `apps/web`
- Shared types — those live in `packages/shared`

## Boundary Rules

- Must never import from `apps/api` or `apps/web`
- Must never access the database or Redis directly
- Must communicate with the backend exclusively through the REST API and Socket.IO
- Must not duplicate API business logic locally (e.g., ETA calculation)
