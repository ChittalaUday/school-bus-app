# Shared Rules — `packages/shared`

---

- Every export is a public API — treat breaking changes with the same care as an external library
- A breaking change in `packages/shared` requires updating all consumers (`apps/api`, `apps/web`, `apps/mobile`) in the same PR or a coordinated ticket
- Zod schemas are the source of truth for data contracts — TypeScript types are inferred from them, not written separately

```typescript
// Correct pattern — type derived from schema
const tripSchema = z.object({ id: z.string(), status: tripStatusSchema });
export type Trip = z.infer<typeof tripSchema>;

// Avoid — maintaining type and schema separately (they will diverge)
export interface Trip { id: string; status: TripStatus; }
export const tripSchema = z.object({ id: z.string(), status: tripStatusSchema });
```

- No platform-specific code — everything must run in Node.js, browser, and React Native
- No `any` types
- Every export must be explicitly listed in `src/index.ts` — no re-exporting entire modules
- Add new exports in small, focused PRs — avoid large "add all types" commits
- Prefer `const` objects over TypeScript `enum` for all enumeration types
