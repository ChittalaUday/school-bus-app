# Mobile Parent Architecture — `apps/mobile-parent`

---

## Folder Structure

```
apps/mobile-parent/src/
│
├── screens/
│   ├── auth/
│   │   └── LoginScreen.tsx
│   └── home/
│       ├── HomeScreen.tsx
│       ├── TrackingScreen.tsx
│       └── HistoryScreen.tsx
│
├── components/
│   ├── map/
│   │   ├── TrackingMap.tsx
│   │   └── BusMarker.tsx
│   └── trip/
│       └── EtaCard.tsx
│
├── navigation/
│   ├── RootNavigator.tsx         # Auth vs App stack
│   └── HomeNavigator.tsx
│
├── hooks/
│   ├── useBusTracking.ts         # Live position via Socket.IO
│   ├── useEta.ts                 # ETA updates from socket
│   └── useSocket.ts              # Socket.IO connection management
│
├── stores/
│   ├── auth.store.ts             # Zustand: user + tokens
│   └── tracking.store.ts         # Live bus position + ETA
│
├── services/
│   ├── api.ts                    # Axios instance
│   └── socket.ts                 # Socket.IO singleton
│
└── config.ts                     # API URL, socket URL from env
```

---

## Live Tracking Flow

```
TrackingScreen mounts
  └── useBusTracking hook
        ├── CONNECT socket.io
        ├── EMIT join-trip { tripId }
        ├── RECEIVE bus:location → update Zustand tracking store
        ├── RECEIVE eta:updated → update ETA display
        └── MapLibre marker updates via store subscription
```

Socket.IO connection auto-reconnects with exponential backoff. Stale position data is cleared on disconnect rather than shown as current.

---

## Token Storage

- `accessToken` — Zustand in-memory store only
- `refreshToken` — MMKV encrypted storage (survives app restart)

On app launch: read `refreshToken` from MMKV → `POST /api/auth/refresh` → restore session.

---

## Navigation

```
RootNavigator
  ├── AuthStack (not authenticated)
  │   └── LoginScreen
  └── HomeStack (authenticated, role: parent)
        ├── HomeScreen
        ├── TrackingScreen
        └── HistoryScreen
```
