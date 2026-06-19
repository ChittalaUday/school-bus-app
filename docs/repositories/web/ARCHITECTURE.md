# Web Architecture — `apps/web`

## Framework

Next.js App Router. Server Components where possible, Client Components only when interactivity or browser APIs are required.

---

## Folder Structure

```
apps/web/src/
│
├── app/                          # App Router pages and layouts
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Shared dashboard shell
│   │   ├── dashboard/page.tsx
│   │   ├── routes/page.tsx
│   │   ├── buses/page.tsx
│   │   ├── students/page.tsx
│   │   ├── trips/page.tsx
│   │   ├── track/[tripId]/page.tsx
│   │   └── reports/page.tsx
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn/ui generated components
│   ├── map/                      # MapLibre components
│   │   ├── BaseMap.tsx
│   │   ├── BusMarker.tsx
│   │   ├── RouteLayer.tsx
│   │   └── StopMarker.tsx
│   ├── trips/
│   ├── routes/
│   ├── students/
│   └── shared/
│
├── hooks/
│   ├── useSocket.ts              # Socket.IO connection hook
│   ├── useBusTracking.ts         # Live bus position + ETA
│   └── useAuth.ts
│
├── stores/
│   ├── auth.store.ts             # Zustand auth state
│   └── tracking.store.ts         # Live bus positions
│
├── lib/
│   ├── api.ts                    # Axios instance + interceptors
│   └── utils.ts                  # shadcn/ui cn() helper
│
└── types/
    └── index.ts                  # Re-exports from apps/shared
```

---

## Data Fetching Strategy

| Data Type | Method |
| ----------------------------- | ------------------------------- |
| Static data (schools, routes) | Next.js Server Components fetch |
| Auth-gated data | Client fetch via Axios |
| Live bus positions | Socket.IO (client component) |
| Form submissions | React Hook Form + Axios |

---

## Auth Flow

```
Login page → POST /api/auth/login
  ├── Success → store accessToken in Zustand + cookie
  ├── 401 → show error
  └── All subsequent requests: Authorization: Bearer <token>

Token expiry → Axios interceptor detects 401
  └── POST /api/auth/refresh → new tokens → retry original request
```

---

## Map Architecture

MapLibre GL JS with OpenStreetMap raster tiles.

```
<BaseMap>                    ← MapLibre GL canvas
  <RouteLayer />             ← GeoJSON LineString from API
  <StopMarker stop={...} />  ← GeoJSON Point per stop
  <BusMarker bus={...} />    ← Live position, updates via Socket.IO
```

Bus marker position updates use MapLibre's `setData()` on the GeoJSON source — no component remount.

---

## State Management

Zustand stores for:
- Auth state (user, tokens)
- Live tracking state (bus positions, ETAs per trip)

Server state (trips list, students, routes) fetched fresh on page load — not stored in Zustand.
