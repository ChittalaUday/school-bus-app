# Mobile Driver Constraints — `apps/mobile-driver`

---

## Performance

- App cold start < 3s on a mid-range Android device (Redmi-class)
- Map initialization < 3s on 4G
- Background location must not drain > 5% battery per hour

## Network

- Handle network loss — queue location updates locally and flush on reconnect
- Hyderabad 4G can be unreliable; use exponential backoff for POST retries

## Device Support

- iOS 14+
- Android 8+ (API level 26+)

## Background Location

- iOS: requires `NSLocationAlwaysAndWhenInUseUsageDescription` in Info.plist
- Android: requires `ACCESS_BACKGROUND_LOCATION` in AndroidManifest.xml
- Background location active only during an active trip — must stop on trip completion or process kill

## Bundle Size

- No heavy dependencies without justification
- No `moment.js` — use `date-fns`

## Offline

- Auth tokens survive restart via MMKV
- Offline tracking is NOT supported — location posts require a live connection
- Show a clear "no connection" indicator rather than failing silently
