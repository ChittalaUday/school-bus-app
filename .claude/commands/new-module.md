# Scaffold a New API Module

Scaffold a new module in `apps/api/src/modules/` following the Govexa modular monolith pattern.

**Usage:** `/new-module {module-name} GOV-{ID}`

- Example: `/new-module attendance GOV-015`

---

For the module name and ticket `$ARGUMENTS`:

1. Read `docs/repositories/api/ARCHITECTURE.md` to confirm the exact file structure required.
2. Read `docs/repositories/api/RULES.md` for naming conventions.
3. Read `docs/repositories/api/DESIGN_PRINCIPLES.md` for service and handler patterns.

4. Create the following files under `apps/api/src/modules/{module-name}/`:

**`{module}.plugin.ts`** — Fastify plugin that registers routes and injects dependencies
```typescript
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { {Module}Service } from "./{module}.service";
import { register{Module}Routes } from "./{module}.routes";

const {module}Plugin: FastifyPluginAsync = async (fastify) => {
  const {module}Service = new {Module}Service(fastify.prisma, fastify.redis);
  await register{Module}Routes(fastify, {module}Service);
};

export default fp({module}Plugin);
```

**`{module}.routes.ts`** — Thin route handlers only (max 15 lines per handler)

**`{module}.service.ts`** — All business logic (no Fastify dependency, injectable)

**`{module}.schema.ts`** — Zod schemas for all request/response shapes

**`{module}.test.ts`** — Test file with at least one test stub per service method

5. After scaffolding, remind the developer:
   - Register the plugin in `apps/api/src/app.ts`
   - Export any shared types to `apps/shared` if web or mobile will consume them
   - Every service method needs a test before the ticket is done (per `CONSTRAINTS.md`)
