# Web Constraints — `apps/web`

---

## Performance

- Largest Contentful Paint (LCP) < 2.5s on dashboard pages
- MapLibre map must initialize and show tiles within 3s on a 4G connection
- Socket.IO reconnect must be transparent to the user (auto-reconnect with exponential backoff)
- Bundle size: no library over 100KB added without justification

## Browser Support

- Modern browsers only (Chrome, Firefox, Safari, Edge — last 2 versions)
- No IE11 support
- Mobile browser support required (parents may use web on mobile)

## Maps

- OpenStreetMap tiles only — no Google Maps, Mapbox (cost/privacy)
- MapLibre GL JS for all map rendering
- Map components are heavy — lazy-load with `dynamic(() => import(...), { ssr: false })`

## Auth

- Access tokens stored in memory (Zustand) — not localStorage (XSS risk)
- Refresh token stored in httpOnly cookie — not accessible to JavaScript
- On page refresh, re-authenticate from cookie before rendering protected pages

## Environment Variables

- Only `NEXT_PUBLIC_*` variables are available client-side
- Never expose API secrets in `NEXT_PUBLIC_*` vars
- Required: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`, `NEXT_PUBLIC_MAP_TILES_URL`

## No Server-Side Secrets

- The web app has no server-side secrets — it is a client for the API
- Next.js API routes must NOT be created — all backend logic is in `apps/api`
