# Mobile Parent — `apps/mobile-parent`

React Native app for parents.

---

## Purpose

Live tracking of the child's school bus, ETA to their stop, and push notification handling.

## Stack

| Technology | Role |
| ----------------------------- | ---- |
| React Native | Framework |
| TypeScript | Language |
| Zustand | State management |
| MMKV | Encrypted local storage (tokens) |
| Axios | API communication |
| Socket.IO Client | Live bus position + ETA updates |
| MapLibre React Native | Live tracking map |
| React Navigation | Navigation |

## Setup (when project is created)

```bash
cd apps/mobile-parent
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
Login → Home
  ├── Child's bus live position on map
  ├── ETA to their child's stop
  ├── Trip history
  └── Notification preferences
```

## Related Docs

- [Architecture](ARCHITECTURE.md)
- [Rules](RULES.md)
- [Constraints](CONSTRAINTS.md)
- [Responsibilities](RESPONSIBILITIES.md)
