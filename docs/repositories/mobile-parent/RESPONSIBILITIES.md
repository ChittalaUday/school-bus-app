# Mobile Parent Responsibilities — `apps/mobile-parent`

---

## Owns

- Parent authentication flow (login, token refresh, logout)
- Live bus tracking UI (MapLibre map + Socket.IO position updates)
- ETA display per stop
- Trip history view
- Push notification opt-in and display
- Encrypted local token storage (MMKV)

## Does NOT Own

- Business logic — that is `apps/api`
- ETA calculation — that is `apps/api` + GraphHopper
- Notification sending — that is `apps/api` + Novu
- Driver-facing features — that is `apps/mobile-driver`
- Admin functionality — that is `apps/web`
- Route or fleet management — that is `apps/web`
- Shared types — those live in `packages/shared`

## Boundary Rules

- Must never import from `apps/mobile-driver`, `apps/api`, or `apps/web`
- Must never access PostgreSQL, Redis, or GraphHopper directly
- All backend communication exclusively via REST API and Socket.IO
- Must not replicate ETA or routing logic locally
