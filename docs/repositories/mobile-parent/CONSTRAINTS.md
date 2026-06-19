# Mobile Parent Constraints — `apps/mobile-parent`

---

## Performance

- App cold start < 3s on a mid-range Android device (Redmi-class)
- Map initialization < 3s on 4G
- Socket.IO reconnect must be invisible to the user (< 2s reconnect on 4G)

## Network

- Hyderabad 4G can be unreliable — Socket.IO must auto-reconnect with exponential backoff
- No persistent state required across socket disconnections — refetch on reconnect
- Show a clear "reconnecting" indicator during socket outage

## Device Support

- iOS 14+
- Android 8+ (API level 26+)
- No tablet-specific layouts required

## Bundle Size

- No heavy dependencies without justification
- No `moment.js` — use `date-fns`

## Offline

- Auth tokens survive restart via MMKV
- Live tracking requires an active connection — show "no connection" state rather than stale data
- Trip history can be cached locally for offline viewing
