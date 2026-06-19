# Mobile Constraints — `apps/mobile`

---

## Performance

- App cold start < 3s on a mid-range Android device (Redmi-class)
- Map initialization < 3s on 4G
- Socket.IO reconnect must be invisible to the user
- Background location must not drain > 5% battery per hour

## Network

- Handle network loss gracefully — queue location updates locally and flush when reconnected
- Hyderabad 4G networks can be unreliable — Socket.IO must auto-reconnect with backoff
- Assume connections will drop frequently — no state that requires persistent socket

## Device Support

- iOS 14+
- Android 8+ (API level 26+)
- No tablet-specific layouts required

## Bundle Size

- Keep the app size lean — no heavy dependencies without justification
- MapLibre adds ~15MB to the bundle — accepted and justified
- No moment.js — use `date-fns` for date formatting

## Background Location

- iOS: requires `NSLocationAlwaysAndWhenInUseUsageDescription` — handled in Info.plist
- Android: requires `ACCESS_BACKGROUND_LOCATION` — handled in AndroidManifest.xml
- Background location only for drivers during active trips — must stop when trip completes or app is killed

## Offline

- Auth tokens survive app restart (MMKV)
- Offline mode is NOT supported — requires live connection for tracking
- Show clear "no connection" state rather than stale data
