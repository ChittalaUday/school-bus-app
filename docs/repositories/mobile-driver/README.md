# Mobile Driver — `apps/mobile-driver`

React Native app for bus drivers.

---

## Purpose

GPS location broadcasting during active trips, turn-by-turn navigation, and student boarding confirmation.

## Stack

| Technology | Role |
| ----------------------------- | ---- |
| React Native | Framework |
| TypeScript | Language |
| Zustand | State management |
| MMKV | Encrypted local storage (tokens) |
| Axios | API communication |
| Socket.IO Client | Trip status updates |
| MapLibre React Native | Turn-by-turn map |
| React Navigation | Navigation |
| react-native-background-geolocation | Background GPS |

## Setup (when project is created)

```bash
cd apps/mobile-driver
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

```
Login → Trip List → Active Trip
  ├── Map (turn-by-turn via GraphHopper directions)
  ├── Stop List (mark students as boarded / absent)
  └── SOS Button
```

## Related Docs

- [Architecture](ARCHITECTURE.md)
- [Rules](RULES.md)
- [Constraints](CONSTRAINTS.md)
- [Responsibilities](RESPONSIBILITIES.md)
