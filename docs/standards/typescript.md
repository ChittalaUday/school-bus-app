# TypeScript Standards

Applies to all TypeScript projects: `apps/api`, `apps/web`, `apps/mobile`, `packages/shared`.

---

## Compiler Settings

All projects extend a shared `tsconfig.base.json` from the root.

Required settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true
  }
}
```

`strict: true` is non-negotiable. No project may disable it.

---

## No `any`

`any` is forbidden except in explicitly marked escape hatches.

```typescript
// Forbidden
function process(data: any) {}

// Allowed (with comment explaining why)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyConfig = config as any; // PostGIS raw query result type
```

Use `unknown` when the type is genuinely unknown and must be narrowed:

```typescript
function processWebhook(payload: unknown) {
  const parsed = webhookSchema.parse(payload); // Zod narrows the type
}
```

---

## Zod for All Input Boundaries

Every external input must be validated with Zod before use:

```typescript
// API route input
const bodySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Form input (web/mobile)
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Never trust `req.body` without parsing through Zod.

---

## Type vs Interface

- Use `type` for unions, intersections, and mapped types
- Use `interface` for object shapes that may be extended

```typescript
// type for unions
type TripStatus = "scheduled" | "active" | "completed" | "force_closed";

// interface for extensible shapes
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Trip extends BaseEntity {
  status: TripStatus;
  busId: string;
}
```

---

## Enums

Prefer `const` objects over TypeScript `enum`:

```typescript
// Preferred
export const UserRole = {
  SUPER_ADMIN: "super_admin",
  SCHOOL_ADMIN: "school_admin",
  DRIVER: "driver",
  PARENT: "parent",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Avoid
enum UserRole { SuperAdmin = "super_admin" }
```

---

## Null and Undefined

- Prefer `undefined` over `null` in application code
- Use `null` only where required by external APIs (Prisma returns `null` for optional relations)
- Always handle both when working with Prisma results

---

## Path Aliases

Each project configures path aliases for clean imports:

```typescript
// tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"],
    "@shared/*": ["../../packages/shared/src/*"]
  }
}

// Usage
import { TripStatus } from "@shared/types";
import { authPlugin } from "@/plugins/auth";
```

Never use relative imports that go up more than two levels (`../../..`).

---

## File Naming

| Type | Convention | Example |
| ----------- | ---------- | ----------------------- |
| Files | kebab-case | `trip-service.ts` |
| Classes | PascalCase | `GraphHopperClient` |
| Functions | camelCase | `calculateEta` |
| Constants | SCREAMING_SNAKE or camelCase | `MAX_RETRY_COUNT` |
| Types/Interfaces | PascalCase | `TripWithStops` |
| Zod schemas | camelCase + `Schema` suffix | `locationUpdateSchema` |
