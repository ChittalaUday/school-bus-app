# Shared Architecture — `packages/shared`

---

## Structure

```
packages/shared/
├── src/
│   ├── types/        # TypeScript type definitions
│   ├── schemas/      # Zod validation schemas
│   ├── constants/    # Shared constants
│   └── index.ts      # Barrel export (all public exports)
├── package.json
└── tsconfig.json
```

---

## What Lives Here

### Types (`src/types/`)

TypeScript interfaces and types for domain entities. These mirror Prisma models but are decoupled — not generated from Prisma.

```typescript
// trip.types.ts
export interface Trip {
  id: string;
  status: TripStatus;
  busId: string;
  routeId: string;
  driverId: string;
  scheduledDate: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface TripWithStops extends Trip {
  stops: TripStop[];
}
```

### Schemas (`src/schemas/`)

Zod schemas used for validation at input boundaries. The API uses them for request body validation. Web/mobile use them for form validation.

```typescript
// location.schema.ts
export const locationUpdateSchema = z.object({
  busId: z.string().uuid(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  heading: z.number().min(0).max(360).optional(),
  speed: z.number().min(0).optional(),
});

export type LocationUpdate = z.infer<typeof locationUpdateSchema>;
```

### Constants (`src/constants/`)

Shared enumeration values as `const` objects (not TypeScript enums).

```typescript
// roles.ts
export const UserRole = {
  SUPER_ADMIN: "super_admin",
  SCHOOL_ADMIN: "school_admin",
  DRIVER: "driver",
  PARENT: "parent",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// socket-events.ts
export const SOCKET_EVENTS = {
  BUS_LOCATION: "bus:location",
  ETA_UPDATED: "eta:updated",
  TRIP_STARTED: "trip:started",
  TRIP_COMPLETED: "trip:completed",
  STUDENT_BOARDED: "student:boarded",
} as const;
```

---

## Dependency Rule

`packages/shared` has zero runtime dependencies (except `zod`).

It must be importable in Node.js, browser, and React Native without modification.
