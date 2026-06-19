# Mobile — `apps/mobile`

React Native app for drivers and parents.

---

## Purpose

Two audiences in one app, separated by role after login:

- **Driver**: Broadcasts GPS location, views assigned trips, confirms student boarding
- **Parent**: Tracks their child's bus live, receives push notifications, views ETAs

## Stack

| Technology | Role |
| --------------------- | ---- |
| React Native | Framework |
| TypeScript | Language |
| Zustand | State management |
| MMKV | Local storage (tokens, preferences) |
| Axios | API communication |
| Socket.IO Client | Realtime bus tracking |
| MapLibre React Native | Maps |
| React Navigation | Navigation |

## Setup (when project is created)

```bash
cd apps/mobile
pnpm install
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Commands

```bash
pnpm start          # Metro bundler
pnpm ios            # Run on iOS simulator
pnpm android        # Run on Android emulator
pnpm test           # Jest tests
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
```

## Screens

### Driver Flow

```
Login → Trip List → Active Trip
  ├── Map (turn-by-turn via GraphHopper)
  ├── Stop List (mark students as boarded/absent)
  └── SOS Button
```

### Parent Flow

```
Login → Home
  ├── Child's bus live position on map
  ├── ETA to their stop
  ├── Trip history
  └── Notification preferences
```

## Related Docs

- [Architecture](ARCHITECTURE.md)
- [Rules](RULES.md)
- [Constraints](CONSTRAINTS.md)
- [Responsibilities](RESPONSIBILITIES.md)
