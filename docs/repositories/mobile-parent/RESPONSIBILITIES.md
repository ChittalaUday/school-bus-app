# Mobile Parent Responsibilities — `apps/mobile-parent`

---

## Owns

### Authentication
- Parent login, JWT token management, session restore on app launch
- Encrypted local token storage (MMKV)
- Session must never expire during an active trip without silent refresh

### Student Status Display
Display the current status of each linked student using the canonical status states:

| Status | Trigger |
|---|---|
| Waiting For Pickup | Trip started, student not yet boarded |
| Bus Approaching | Bus within proximity threshold of student's stop |
| On Bus | Student marked Boarded |
| Arrived At School | School arrival recorded |
| Returning Home | Evening trip started, student boarded return trip |
| Dropped Home | Student marked Dropped at their stop |
| Absent | Marked Absent at pickup stop |
| On Leave | Leave Approved — not traveling today |

### Live Bus Tracking
- Map showing current bus position (via Socket.IO)
- Route path with completed vs. remaining segments
- ETA to student's pickup or drop stop
- Visual staleness indicator when GPS data is older than 60 seconds

### Notification Display
Receive and display push notifications for all journey events:
- Trip started / bus approaching student's stop
- Student boarded / marked absent / not found at stop
- Student arrived at school
- Student boarded return trip
- Student approaching drop stop / dropped at home stop
- Delay notification

Deep-link from notification directly to the relevant student status screen.

### Trip History
- View past trips and attendance records for linked students
- View historical arrival and drop times

---

## Does NOT Own

- Business logic — that is `apps/api`
- ETA calculation — that is `apps/api` + GraphHopper
- Notification sending (push, SMS, Telegram) — that is `apps/api` + Novu
- Driver-facing trip execution — that is `apps/mobile-driver`
- Admin / management functionality — that is `apps/web`
- Route or fleet configuration — that is `apps/web`
- Shared types and schemas — those live in `apps/shared`
- Any write operations on transportation data — parents are read-only

---

## Boundary Rules

- Must never import from `apps/mobile-driver`, `apps/api`, or `apps/web`
- Must never access PostgreSQL, Redis, or GraphHopper directly
- All backend communication exclusively via REST API and Socket.IO
- Parent app is read-only — no actions that modify trip, attendance, or student data
- Must not show stale GPS position as current — always timestamp live data and detect staleness
- Must not replicate ETA or routing logic locally
