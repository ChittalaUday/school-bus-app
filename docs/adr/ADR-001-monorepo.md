# ADR-001: pnpm Monorepo with Workspaces

**Status:** Accepted
**Date:** 2026-06-19

## Context

Govexa consists of multiple projects that share types and business logic: an API, a web app, a mobile app, and shared packages. We need a repository structure that allows code sharing while keeping projects independently deployable and maintainable.

## Decision

Use a **pnpm monorepo with workspaces**.

```
root/
├── apps/
│   ├── api/
│   ├── web/
│   └── mobile/
├── packages/
│   └── shared/
└── pnpm-workspace.yaml
```

## Rationale

- **Type sharing**: `apps/shared` allows TypeScript types and Zod schemas to be shared between API, web, and mobile without duplication or divergence
- **Single source of truth**: One repository for issues, PRs, and CI configuration
- **pnpm over npm/yarn workspaces**: Faster installs, strict dependency isolation (no phantom dependencies), smaller `node_modules` via content-addressable store
- **Not Turborepo (yet)**: Added when build caching becomes a pain point. Premature optimization at this stage.

## Consequences

- All projects share the same `pnpm-lock.yaml` — dependency updates affect all projects
- `apps/shared` must be versioned carefully — breaking changes require coordinated updates
- Mobile (`apps/mobile`) will need its own build tooling separate from the workspace (Metro bundler doesn't play well with workspace symlinks by default — managed via `metro.config.js` resolver)

## Alternatives Considered

| Option | Reason Rejected |
| -------------------- | ---------------------------------------------- |
| Separate repositories | No shared types, divergence risk, more CI overhead |
| npm workspaces | Slower, phantom dependencies |
| Nx | Overhead and complexity not justified at this stage |
