# Mobile Driver Architecture — `apps/mobile-driver`

---

## Folder Structure

```
apps/mobile-driver/src/
│
├── screens/
│   ├── auth/
│   │   └── LoginScreen.tsx
│   └── trip/
│       ├── TripListScreen.tsx
│       ├── ActiveTripScreen.tsx
│       └── StopDetailScreen.tsx
│
├── components/
│   ├── map/
│   │   ├── TripMap.tsx
│   │   └── RoutePolyline.tsx
│   └── stops/
│       └── StopRow.tsx
│
├── navigation/
│   ├── RootNavigator.tsx         # Auth vs App stack
│   └── TripNavigator.tsx
│
├── hooks/
│   ├── useLocation.ts            # Device GPS + background broadcasting
│   ├── useTrip.ts                # Active trip state
│   └── useSocket.ts              # Trip status updates
│
├── stores/
│   ├── auth.store.ts             # Zustand: user + tokens
│   └── trip.store.ts             # Current trip + stop progress
│
├── services/
│   ├── api.ts                    # Axios instance
│   ├── location.ts               # Background GPS broadcaster
│   └── socket.ts                 # Socket.IO singleton
│
└── config.ts                     # API URL from env
```

---

## GPS Broadcasting Flow

```
ActiveTripScreen mounts
  └── useLocation hook
        ├── Request foreground + background location permission
        ├── Start watchPosition (every 3 seconds)
        └── Each update → POST /api/tracking/location
              { busId, lat, lng, heading, speed }
```

Background location continues when app is backgrounded during an active trip. Stops automatically when the trip is completed or the process is killed.

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
  └── TripStack (authenticated, role: driver)
        ├── TripListScreen
        └── ActiveTripScreen
```
