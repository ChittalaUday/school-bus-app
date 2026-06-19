# Parent App Design Principles — `apps/mobile-parent`

These principles exist because the parent app has one job: giving a parent peace of mind about their child's safety. Every design decision must be evaluated against that mission.

---

## 1. Peace of Mind Is the Product

The parent opens the app because they are anxious about their child. The app's job is to remove that anxiety as quickly and clearly as possible.

Every screen, every notification, every label should be evaluated by asking: "Does this make the parent feel more or less certain about their child's safety?"

---

## 2. The Home Screen Answers the One Question

"Where is my child right now?"

The home screen must answer this question in under 3 seconds of opening the app. No login friction after the initial setup, no navigation required, no loading screens that stall on the status. The current student status is the hero element.

---

## 3. Notifications Do the Heavy Lifting

Most parents will not open the app proactively. They will open it because a notification told them something happened. This means:

- Notification copy must be complete — it should not require opening the app to understand what happened
- Tapping the notification must deep-link directly to the relevant student status screen
- Notifications must never be ambiguous ("Your child's bus update" is useless)

Good notification: "Arjun has been dropped at Jubilee Hills Stop (4:18 PM)"
Bad notification: "Transportation update for your child"

---

## 4. Never Show Stale Data as Current

If the last known GPS update is old, say so. If the trip hasn't started, say so. If there is no active trip today (weekend, holiday), say so.

A parent seeing an outdated location on the map is worse than seeing no location at all — they may make decisions based on wrong information (driving to the wrong stop, calling the school unnecessarily).

Show a clear timestamp on all live data. Show "No active trip today" rather than yesterday's last known state.

---

## 5. Simple Language, No Jargon

Parents are not transportation operations managers. They should never see:
- Internal trip IDs
- Route codes
- Technical status strings like `IN_TRANSIT_STOP_3`

They should see:
- "Your bus is 2 stops away — arriving in about 8 minutes"
- "Arjun is on the bus heading to school"
- "Arjun has arrived safely at school"

Status labels in `packages/shared` must have a parent-facing display string, not just the internal enum value.

---

## 6. One Child, One Focus

Even if a parent has multiple children using the bus, the UI must present one child's status at a time. The status of Child A must not visually compete with the status of Child B.

The default view shows the most relevant child (the one with an active or upcoming trip). Switching between children is explicit and deliberate.

---

## 7. Map Is Context, Not the Primary Interface

Parents care that their child is safe — not about the exact GPS coordinate of the bus. The map is supplementary context. The status card (text + status label) is the primary interface.

Some parents do not understand how to read a map. The app must be fully usable without ever looking at the map.

---

## 8. No Operational Controls for Parents

Parents cannot:
- Start or stop a trip
- Change a student's bus assignment
- Mark their child as absent (that is the school's responsibility)
- View other students' information

The parent app is read-only. Any prompt that implies the parent can take an action on the transportation system is a design error.

The only action parents can take is viewing and (in future) requesting leave approval — which is a request, not a direct change.

---

## 9. Authentication Should Be Invisible After Setup

After the initial login, the parent should never be asked to log in again. Token refresh is fully automatic. MMKV encrypted storage keeps the session alive across app restarts.

A session expiry that locks a parent out during an active trip (their child is on the bus, they can't see where) is a product failure.

---

## 10. Handle Network Failure Gracefully

Parents may be on poor mobile connections. The app must:
- Show cached last-known status when offline rather than an error screen
- Clearly label cached data as potentially outdated with a timestamp
- Auto-reconnect Socket.IO with exponential backoff without user action
- Never show a crash or white screen on network failure
