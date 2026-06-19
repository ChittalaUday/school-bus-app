# Scaffold a New Web Page

Scaffold a new page in `apps/web/src/app/` following the Govexa Next.js App Router structure.

**Usage:** `/new-page {section}/{page-name} GOV-{ID}`

- Example: `/new-page students/[id] GOV-022`
- Example: `/new-page live/page GOV-031`

---

For the page path and ticket `$ARGUMENTS`:

1. Read `docs/repositories/web/ARCHITECTURE.md` to confirm placement in the folder structure.
2. Read `docs/repositories/web/DESIGN_PRINCIPLES.md` — especially:
   - Is this a Server Component or does it need `"use client"`?
   - Does it need Socket.IO (live data)?
   - Is this behind the `(dashboard)` layout group?
3. Read `docs/product/PRODUCT.md` section 12 (School Administrator Experience) to confirm what this page must display.

4. Create the page file at the correct path under `apps/web/src/app/(dashboard)/`.

5. Apply the correct pattern based on the page type:

**Server Component page (static/admin data):**
```typescript
// No "use client"
import { apiClient } from "@/lib/api";

export default async function {PageName}Page() {
  const data = await apiClient.get("/{endpoint}");
  return <div>{/* render data */}</div>;
}
```

**Client Component page (live data / interactive):**
```typescript
"use client";
import { useSocket } from "@/hooks/useSocket";
// ...
```

6. Create a matching component file in `apps/web/src/components/{section}/` if the page needs a dedicated component.

7. After scaffolding, remind the developer:
   - Add the page to the sidebar navigation in `(dashboard)/layout.tsx`
   - Role-gate the page if it is not accessible to all web roles (Admin + Transportation Manager)
   - Never call the API directly from the component — use hooks or server component fetch
