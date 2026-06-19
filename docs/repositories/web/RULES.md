# Web Rules — `apps/web`

---

## Component Rules

- Prefer Server Components — only use `"use client"` when the component needs browser APIs, event handlers, or hooks
- No business logic in components — components render data, they don't transform it
- No API calls directly in components — use hooks or server component data fetching patterns
- Components receive data as props — they don't fetch their own data (except page-level components)

## API Communication

- All API calls go through the centralized Axios instance in `lib/api.ts`
- Never use `fetch` directly — use the Axios instance which has auth interceptors
- Never hardcode the API base URL — use `NEXT_PUBLIC_API_URL` env var

## Forms

- All forms use React Hook Form + Zod resolver
- Zod schemas imported from `apps/shared` when the schema is shared with the API
- No uncontrolled inputs in forms that submit to the API

## Map (MapLibre)

- All MapLibre components must be `"use client"` — MapLibre requires browser APIs
- Update bus position with `map.getSource('bus').setData(...)` — never re-render the component
- Dispose of map instance in `useEffect` cleanup to prevent memory leaks

## State

- Zustand only for global state that multiple components need (auth, live tracking)
- Local UI state (modal open/close, form step) stays in component with `useState`
- Never store derived data in Zustand — compute it from the stored source

## Naming

| Item | Convention |
| -------------------- | ----------- |
| Page files | `page.tsx` (Next.js convention) |
| Layout files | `layout.tsx` |
| Component files | PascalCase — `TripCard.tsx` |
| Hook files | camelCase — `useBusTracking.ts` |
| Store files | camelCase — `auth.store.ts` |
| Utility files | camelCase — `api.ts` |

## Styling

- Tailwind CSS utility classes only — no inline `style` props except for dynamic values (map dimensions)
- shadcn/ui components for all standard UI elements — do not rebuild what shadcn provides
- No CSS modules or styled-components

## No Direct Database Access

The web app must never access PostgreSQL or Redis directly. All data comes from the API.

---

## Comments

- Do not add comments that describe what the code does — well-named components, hooks, and props do that
- Only add a comment when the **why** is non-obvious: a hidden constraint, a workaround for a browser quirk, or something that would genuinely surprise a future reader
- No commented-out code — delete it; git history is the record
- One line max — no multi-line comment blocks

---

## Commits

- Format: `type(scope): GOV-{ID} short description`
- Allowed types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Subject line: imperative mood, max 72 characters, no trailing period
- One logical change per commit — never bundle unrelated changes
- Never commit: commented-out code, `console.log`, or TODO comments without a ticket reference (`GOV-{ID}`)
- Message must describe **why**, not what — the diff already shows what changed
