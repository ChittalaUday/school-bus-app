# Web — `apps/web`

Next.js admin and school portal.

---

## Purpose

Browser-based portal for Super Admins and School Admins. Provides route management, fleet management, student management, live trip monitoring, and reporting.

## Stack

| Technology | Role |
| -------------- | ---- |
| Next.js (App Router) | Framework |
| TypeScript | Language |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Zustand | Client state |
| React Hook Form | Forms |
| Zod | Form validation |
| MapLibre GL JS | Maps |
| Socket.IO Client | Realtime updates |
| Lucide Icons | Icons |
| Axios | API calls |

## Setup (when project is created)

```bash
cd apps/web
pnpm install
cp .env.local.example .env.local   # fill in API URL
pnpm dev                            # start dev server :3001
```

## Commands

```bash
pnpm dev        # Dev server on :3001
pnpm build      # Production build
pnpm start      # Run production build
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
pnpm test       # Vitest unit tests
```

## Pages

| Route | Role | Description |
| ------------------- | ------------ | --------------------------------- |
| `/` | All | Login |
| `/dashboard` | Admin/School | Overview stats |
| `/routes` | Admin | Route + stop management on map |
| `/buses` | Admin | Fleet management |
| `/students` | School Admin | Student roster, route assignment |
| `/trips` | Admin | Today's trips, live status |
| `/track/[tripId]` | Admin/Parent | Live map — bus + ETA |
| `/reports` | Admin | Historical trip data |

## Related Docs

- [Architecture](ARCHITECTURE.md)
- [Rules](RULES.md)
- [Constraints](CONSTRAINTS.md)
- [Responsibilities](RESPONSIBILITIES.md)
