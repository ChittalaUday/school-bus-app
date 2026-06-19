# Driver App Design Principles — `apps/mobile-driver`

These principles exist because the driver app is used while standing outside a moving bus, on a budget Android phone, in varying light conditions, often with poor connectivity. Every decision must account for that reality.

---

## 1. Offline Is the Default Assumption

The driver app must work as if there is no internet. Network availability is a bonus.

All actions (attendance marks, GPS locations, incident reports) are queued locally and synced when connectivity returns. The UI must reflect local state, not server state — the driver cannot wait for a network round trip to confirm that a student was marked as boarded.

---

## 2. One Hand, Standing Up

The driver does not sit at a desk. They stand at a bus door, managing a line of students. The UI must work with one thumb on a 6-inch screen.

- Tap targets must be at minimum 48×48dp
- Primary attendance actions (Boarded, Absent) must be reachable without scrolling on most devices
- No gestures that require two hands (pinch, multi-touch swipe)
- Critical actions must not require zooming in

---

## 3. Student Photo Is the Primary Identifier

Drivers do not know every student by name — especially at the start of a new academic year. The student photo must be the most prominent element in the attendance list row.

Name and class are secondary context. Photo is how the driver identifies who they are marking.

Photos must be pre-cached before the trip starts — never lazy-loaded during attendance.

---

## 4. Attendance Must Be Fast

At a busy stop, the driver may need to mark 8–12 students in under 90 seconds. The attendance flow must be optimized for speed:

- Students at the current stop are shown — not the full trip list
- "Boarded" is the default/primary action (most common case)
- Exception states (Absent, Leave Approved) require one extra tap — intentional friction to prevent accidents
- No confirmation dialogs for the Boarded action

---

## 5. GPS Runs Whether the Driver Looks at the App or Not

Background GPS broadcasting is a core responsibility of this app. The driver locks their phone and puts it in their pocket. Location updates must continue.

This means:
- Background location permission must be requested and explained clearly at setup
- The app must never require the screen to be on to continue broadcasting
- Battery usage is a real concern — GPS interval of 5 seconds is the max during active trips

---

## 6. The App Never Blocks the Driver

If an API call fails (sync error, timeout, server error), the driver must still be able to continue the trip and mark attendance. The error must be surfaced as a non-blocking status indicator, not a blocking error modal.

The only blocking error is authentication expiry — and even then, the driver must be shown a clear path back into the trip without losing queued actions.

---

## 7. Trip State Is Authoritative — UI Follows State

The current trip state (`not_started` → `active` → `at_stop` → `in_transit` → `completed`) drives what the driver sees. Each screen corresponds to a state, and the driver cannot navigate to a screen that doesn't match the current state.

This prevents: marking attendance for the wrong stop, completing a trip with unvisited stops, starting a new trip mid-way through an existing one.

---

## 8. Incident Reporting Is Fast to Start, Slow to Submit

Reporting an incident (delay, breakdown, accident) should take one tap to begin. The driver should be able to flag "incident in progress" immediately, and fill in the details when it's safe to do so.

A started-but-incomplete incident report is valid and useful. Waiting for all details before reporting is not.

---

## 9. No Unnecessary Decisions Presented to the Driver

The driver's job during a trip is to drive and mark attendance. The app must not present decisions, configuration choices, or settings screens during an active trip.

Settings, profile changes, and trip history are accessible but never shown in the active-trip flow.

---

## 10. Respect the Battery and Data Budget

Many drivers use personal phones on personal data plans. The app must minimize:
- Unnecessary background network calls (no polling — push or queue only)
- Image payloads (student photos are cached, compressed, not re-downloaded per trip)
- Unnecessary location tracking when not in an active trip (GPS off or low-frequency)
