# Mobile Rules — `apps/mobile`

---

## Component Rules

- One screen = one file in `screens/`
- Screens are thin — fetch data in hooks, render in component
- No business logic in screens — extract to hooks or services
- No inline styles — use StyleSheet.create() or a design system approach

## Navigation

- All navigation through React Navigation — no direct component conditionals for screens
- Deep links handled in `RootNavigator.tsx`
- Never navigate from a service or store — navigate from screens/hooks only

## State

- Zustand for auth and live tracking state
- MMKV for persistent data (tokens, preferences) — not AsyncStorage
- Never store sensitive data unencrypted

## API Communication

- All API calls through the centralized Axios instance in `services/api.ts`
- Token refresh logic in Axios response interceptor — all components benefit automatically
- Never call the API directly with `fetch`

## Location (Driver)

- Always request explicit permission before starting location broadcasting
- Handle permission denied gracefully — show actionable error message
- Stop broadcasting when app goes to background if trip is not active
- Battery optimization: 3-second intervals during active trip, stop when trip is complete

## Maps

- MapLibre React Native for all maps — no Google Maps SDK
- Marker updates go through the source data — no component re-renders for position updates
- Request location permission before rendering map with user position

## Permissions

- Request permissions at the point of use — not at app launch
- Handle all permission states: granted, denied, blocked (must go to settings)

## Naming (Mobile-specific)

| Item | Convention |
| -------------- | ----------- |
| Screen files | PascalCase + `Screen` suffix |
| Navigator files | PascalCase + `Navigator` suffix |
| Component files | PascalCase |
| Hook files | camelCase + `use` prefix |
| Service files | camelCase |

## No Direct Backend Access

Mobile must never access PostgreSQL, Redis, or GraphHopper directly. All communication through the API.
