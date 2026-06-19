# Shared Package Design Principles — `apps/shared`

These principles guide what belongs in shared and how it is structured. The shared package is the contract layer between all applications.

---

## 1. Shared Is a Contract, Not a Utility Bucket

Code goes in `apps/shared` when it represents a contract between two or more applications — not simply because it might be useful in multiple places.

Ask: "If I change this, do I need to update both the API and at least one client?" If yes, it belongs in shared. If it is only used in one application, it stays there.

---

## 2. Zod Schemas Are the Source of Truth

Zod schemas in `apps/shared` are the canonical definition of every data shape that crosses application boundaries. TypeScript types for request bodies, response payloads, and socket events are all derived from Zod schemas using `z.infer<>` — they are never written by hand separately.

If an API response shape changes, the Zod schema changes first. Every consumer that imports that schema gets type errors automatically.

---

## 3. No Runtime-Specific Imports

The shared package must import nothing from Node.js built-ins, React, React Native, Next.js, or Fastify. It contains:
- Zod schemas
- TypeScript types derived from those schemas
- Constants and enums
- Utility functions that are pure and platform-agnostic (string formatting, date formatting, status label helpers)

Any import of `fs`, `path`, `http`, or any framework breaks this rule and will cause build failures in whichever platform can't resolve it.

---

## 4. Enums Have Display Labels

Every status enum (`StudentStatus`, `TripStatus`, `AttendanceStatus`) must export two things:
- The TypeScript enum or `as const` object (for logic and comparisons)
- A display label map (for UI rendering — including parent-facing plain-English labels)

```typescript
export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  BOARDED: "Boarded",
  ABSENT: "Absent",
  NOT_PRESENT: "Not at Stop",
  LEAVE_APPROVED: "On Approved Leave",
};
```

UI code never writes its own label strings for shared status values.

---

## 5. Socket Event Definitions Live Here

Socket.IO event names and their payload types are defined in `apps/shared/socket-events.ts`. This is the shared contract between the API (which emits) and the web/mobile apps (which listen).

```typescript
export const SocketEvents = {
  BUS_LOCATION: "bus:location",
  ETA_UPDATED: "eta:updated",
  ATTENDANCE_RECORDED: "attendance:recorded",
} as const;

export type BusLocationPayload = {
  busId: string;
  lat: number;
  lng: number;
  heading: number;
  tripId: string;
  timestamp: string;
};
```

Renaming an event name in `apps/shared` causes type errors in every file that uses it — making breaking changes visible at compile time.

---

## 6. Keep It Small

The shared package is a build dependency of every application. A large shared package with many transitive dependencies slows down builds across the entire monorepo.

If a utility is only needed by one app, it stays in that app. Don't add it to shared "just in case."

---

## 7. Version Discipline

The shared package is consumed by all apps in the monorepo via workspace linking — changes take effect immediately. This means a breaking change to a shared schema or type immediately breaks all consumers.

Before changing an existing shared type:
- Check all consumers (`grep -r "TypeName" apps/`)
- Update all consumers in the same commit/PR
- Never leave a consumer with a type error after a shared package change
