# Web Responsibilities — `apps/web`

---

## Owns

- Admin portal UI (Super Admin and School Admin roles)
- All browser-based user interactions
- MapLibre map rendering and live tracking visualization
- Socket.IO client connection for live updates
- Client-side auth state management (Zustand)
- Form validation and submission to API

## Does NOT Own

- Business logic — that is `apps/api`
- Data storage — that is `apps/api` + PostgreSQL
- Routing calculations — that is `apps/api` + GraphHopper
- Push notifications — that is `apps/api` + Novu
- Driver functionality — that is `apps/mobile`
- Parent mobile experience — that is `apps/mobile`
- Shared types — those live in `packages/shared`
- Next.js API routes — there are none; all API calls go to `apps/api`

## Boundary Rules

- Must never import from `apps/api` or `apps/mobile`
- Must never access the database or Redis directly
- Must communicate with the backend exclusively through the REST API and Socket.IO
