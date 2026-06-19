# Mobile Driver Responsibilities — `apps/mobile-driver`

---

## Owns

- Driver authentication flow (login, token refresh, logout)
- GPS location broadcasting during active trips
- Active trip UI (stop list, student boarding confirmation, SOS)
- Turn-by-turn navigation map (MapLibre + GraphHopper directions from API)
- Device permission management (GPS, background location)
- Encrypted local token storage (MMKV)

## Does NOT Own

- Business logic — that is `apps/api`
- ETA calculation — that is `apps/api` + GraphHopper
- Notification sending — that is `apps/api` + Novu
- Parent-facing features — that is `apps/mobile-parent`
- Admin functionality — that is `apps/web`
- Route creation or fleet management — that is `apps/web`
- Shared types — those live in `packages/shared`

## Boundary Rules

- Must never import from `apps/mobile-parent`, `apps/api`, or `apps/web`
- Must never access PostgreSQL, Redis, or GraphHopper directly
- All backend communication exclusively via REST API and Socket.IO
- Must not replicate API business logic locally
