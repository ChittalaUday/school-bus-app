# Web Responsibilities — `apps/web`

---

## Owns

### Role Portals
- Super Administrator portal (institution setup, org management, subscriptions)
- School Administrator portal (students, parents, drivers, buses, routes, stops, settings)
- Transportation Manager portal (live operations, incident management, driver monitoring)

### Data Management UIs
- Student management: create, edit, assign to route / pickup stop / drop stop
- Parent management: create, link to student, manage emergency contacts
- Driver management: create, assign to trips
- Bus management: create, set capacity, manage status
- Route management: create routes, add stops, set stop sequence order
- Stop management: create stops with coordinates
- Student transportation assignment management

### Operational UIs
- Live operations map: all active buses, route progress, delay indicators (Transportation Manager + Admin)
- Trip scheduling and management UI
- Attendance history and records view
- Incident log: view, acknowledge, resolve incidents

### Dashboards
- Transportation overview panel (total students, active buses, active routes, drivers on duty)
- Student safety overview (picked up, arrived at school, returning, dropped)
- Exceptions panel (missed pickups, absent students, delayed routes, active incidents)

### Infrastructure
- MapLibre GL JS map rendering and live tracking visualization
- Socket.IO client connection for live bus position and status updates
- Client-side auth state management (Zustand)
- Form validation and submission to API

---

## Does NOT Own

- Business logic — that is `apps/api`
- Data storage — that is `apps/api` + PostgreSQL
- Routing / ETA calculation — that is `apps/api` + GraphHopper
- Push notifications — that is `apps/api` + Novu
- Driver trip execution — that is `apps/mobile-driver`
- Parent real-time tracking experience — that is `apps/mobile-parent`
- Shared types and schemas — those live in `apps/shared`
- Next.js API routes — there are none; all API calls go directly to `apps/api`

---

## Boundary Rules

- Must never import from `apps/api`, `apps/mobile-driver`, or `apps/mobile-parent`
- Must never access PostgreSQL, Redis, or GraphHopper directly
- All backend communication through the REST API and Socket.IO exclusively
- Parents and drivers do not use the web portal — do not build features for those roles here
