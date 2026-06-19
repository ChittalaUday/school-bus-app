# Mobile Parent Rules — `apps/mobile-parent`

---

## Component Rules

- One screen = one file in `screens/`
- Screens are thin — data fetching in hooks, rendering in component
- No business logic in screens — extract to hooks or services
- No inline styles — use `StyleSheet.create()`

## Navigation

- All navigation through React Navigation — no conditional rendering of screens
- Never navigate from a service or store — navigate from screens or hooks only

## State

- Zustand for auth and live tracking state
- MMKV for persistent data (tokens) — not AsyncStorage
- Never store tokens or sensitive data unencrypted
- Clear stale tracking data on socket disconnect — never show stale bus position as live

## API Communication

- All calls through the Axios instance in `services/api.ts`
- Token refresh in the Axios response interceptor
- Never call the API with bare `fetch`

## Maps

- MapLibre React Native only — no Google Maps SDK
- Bus marker updates go through the data source, not component re-renders
- Do not re-request map tiles on every position update — update only the marker source

## Permissions

- Request notification permissions at the point of use, not at app launch
- Handle all states: granted, denied, blocked (open system settings)

## Naming

| Item | Convention |
| -------------- | ----------- |
| Screen files | `PascalCase` + `Screen` suffix |
| Navigator files | `PascalCase` + `Navigator` suffix |
| Component files | `PascalCase` |
| Hook files | `camelCase` + `use` prefix |
| Service files | `camelCase` |

## Boundary

Must never import from `apps/mobile-driver`, `apps/api`, or `apps/web`.
