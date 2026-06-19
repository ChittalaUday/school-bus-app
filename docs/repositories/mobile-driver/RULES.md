# Mobile Driver Rules — `apps/mobile-driver`

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

- Zustand for auth and trip state
- MMKV for persistent data (tokens) — not AsyncStorage
- Never store tokens or sensitive data unencrypted

## API Communication

- All calls through the Axios instance in `services/api.ts`
- Token refresh in the Axios response interceptor
- Never call the API with bare `fetch`

## Location

- Request explicit permission before starting GPS broadcasting
- Handle permission denied and blocked states with actionable messages
- 3-second intervals during active trip only
- Stop broadcasting immediately when the trip completes or the app is killed

## Maps

- MapLibre React Native only — no Google Maps SDK
- Route polyline and marker updates go through the data source, not component re-renders

## Permissions

- Request permissions at the point of use, not at app launch
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

Must never import from `apps/mobile-parent`, `apps/api`, or `apps/web`.
