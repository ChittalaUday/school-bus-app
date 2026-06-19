# Mobile Architecture — `apps/mobile`

---

## Folder Structure

```
apps/mobile/src/
│
├── screens/
│   ├── auth/
│   │   └── LoginScreen.tsx
│   ├── driver/
│   │   ├── TripListScreen.tsx
│   │   ├── ActiveTripScreen.tsx
│   │   └── StopDetailScreen.tsx
│   └── parent/
│       ├── HomeScreen.tsx
│       ├── TrackingScreen.tsx
│       └── HistoryScreen.tsx
│
├── components/
│   ├── map/
│   │   ├── TrackingMap.tsx
│   │   └── BusMarker.tsx
│   ├── trips/
│   └── shared/
│
├── navigation/
│   ├── RootNavigator.tsx         # Auth vs App stack
│   ├── DriverNavigator.tsx
│   └── ParentNavigator.tsx
│
├── hooks/
│   ├── useSocket.ts              # Socket.IO connection
│   ├── useBusTracking.ts         # Live position subscription
│   └── useLocation.ts            # Device GPS (driver only)
│
├── stores/
│   ├── auth.store.ts             # Zustand: user + tokens
│   └── tracking.store.ts         # Live bus positions
│
├── services/
│   ├── api.ts                    # Axios instance
│   ├── location.ts               # Background GPS broadcasting
│   └── socket.ts                 # Socket.IO singleton
│
└── config.ts                     # API URL, socket URL from env
```

---

## Driver Location Broadcasting

```
ActiveTripScreen mounts
  └── useLocation hook
        ├── Request foreground + background location permission
        ├── Start watchPosition (every 3 seconds)
        └── Each update → POST /api/tracking/location
              { busId, lat, lng, heading, speed }
```

Background location continues when app is backgrounded (using `react-native-background-geolocation` or equivalent).

---

## Parent Tracking

```
TrackingScreen mounts
  └── useBusTracking hook
        ├── CONNECT socket.io
        ├── EMIT join-trip { tripId }
        ├── RECEIVE bus:location → update Zustand store
        ├── RECEIVE eta:updated → update ETA display
        └── MapLibre marker updates via store subscription
```

---

## Token Storage

MMKV (not AsyncStorage):
- `accessToken` — in-memory Zustand store
- `refreshToken` — MMKV (encrypted, survives app restart)

On app launch: read refreshToken from MMKV → POST /api/auth/refresh → restore session.

---

## Navigation

React Navigation stack with role-based routing:

```
RootNavigator
  ├── AuthStack (not logged in)
  │   └── LoginScreen
  └── AppStack (logged in)
        ├── DriverStack (role: driver)
        └── ParentStack (role: parent)
```
