# Web Design Principles — `apps/web`

These principles guide every UI decision in the admin portal. They ensure the interface reflects the product mission: student safety, operational accountability, and parent peace of mind.

---

## 1. Student Status Is Always the North Star

Every dashboard panel, every list, every report should make it easy to answer: "Where is this student right now?"

If a screen makes a school administrator work hard to find a student's current status, the design has failed. Student status should be visible without drilling into sub-pages.

---

## 2. Server Components Are the Default

Render on the server unless you have a specific reason not to. The reasons to use `"use client"`:
- The component uses browser APIs (MapLibre, geolocation)
- The component has interactive state (modals, form inputs, dropdowns)
- The component subscribes to Socket.IO events

Everything else — data fetching, rendering lists, displaying reports — is a Server Component.

---

## 3. Real-Time Without Re-mounting

MapLibre markers and route layers must update their position without destroying and recreating DOM. Use `map.getSource('id').setData(newGeoJSON)` — never unmount and remount a map component to reflect a new bus position.

This applies to any live-updating list as well. Use Zustand store subscriptions that update in place, not full re-renders of the parent.

---

## 4. Exceptions Before Normals

The dashboard is an operations tool. The most important thing it communicates is what is wrong, not what is going well.

Exceptions (missed pickups, delayed buses, active incidents) must be visible above the fold on every operational screen. A screen that buries exceptions below a scroll is not useful during a live transportation situation.

---

## 5. Admin Efficiency Over Aesthetics

Transportation administrators manage hundreds of students. Every workflow that requires more than 3 clicks to complete a common task is a design failure.

Priorities:
- Bulk operations (assign multiple students to a route at once)
- Keyboard navigation for table rows
- Search and filter before paginate
- Confirmations only for irreversible destructive actions

---

## 6. Never Show Stale Data as Current

Live tracking data has a timestamp. If the last GPS ping is more than 60 seconds old, the bus marker must show a visual staleness indicator — not the last known position as if it were live.

The same principle applies to student status: if the status hasn't been updated during today's trip, show "No data for today" rather than yesterday's status.

---

## 7. shadcn/ui Is the Component System — Not a Starting Point

Do not rebuild tables, dialogs, dropdowns, date pickers, or form elements. Use shadcn/ui components. Customize through Tailwind variant props and CSS variables — not by copying and modifying the component source.

The exception is map components, which have no shadcn equivalents and must be built from MapLibre primitives.

---

## 8. Forms Validate on the Client and Trust the API

React Hook Form + Zod gives us client-side validation for free. Use the same Zod schemas from `apps/shared` that the API uses. This means validation errors are consistent across web and API.

However: the client validates for UX (instant feedback), not for security. The API is the source of truth. Never skip server-side validation because the client already validated.

---

## 9. Role-Aware Rendering — Not Role-Aware Pages

Transportation Manager and School Administrator use the same pages but see different controls. Use role checks inside components to show/hide actions (delete buttons, edit forms, bulk operations) — not separate page implementations for each role.

Parent and Driver roles do not use the web portal at all.

---

## 10. Map Is a Live Operations Tool, Not a Display

The `/live` map page is an operational tool for the Transportation Manager. It must:
- Show all active buses with real-time position
- Color-code bus markers by status (on-time, delayed, incident)
- Allow clicking a bus to see its trip detail
- Never require a page reload to see the current state

The map is not decorative. It replaces a phone call.
