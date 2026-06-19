# ADR-002: Fastify as API Framework

**Status:** Accepted
**Date:** 2026-06-19

## Context

We need a Node.js HTTP framework for the backend API. The API must handle real-time connections (Socket.IO), background job workers (BullMQ), and REST endpoints with high throughput for location updates from potentially hundreds of concurrent bus tracking sessions.

## Decision

Use **Fastify** as the API framework.

## Rationale

- **Performance**: Fastify is consistently the fastest Node.js framework in benchmarks — critical for the tracking endpoint which receives GPS pings every few seconds from all active buses
- **Schema-first**: Built-in JSON schema validation and serialization via `ajv` — reduces boilerplate
- **Plugin system**: Clean plugin architecture maps directly to our modular monolith structure. Each domain module (`auth`, `routes`, `tracking`) registers as a Fastify plugin with its own scope
- **TypeScript first-class**: Better TypeScript support than Express; route handler types are inferred from schema definitions
- **Swagger built-in**: `@fastify/swagger` generates OpenAPI docs from route schemas automatically
- **Socket.IO compatibility**: `fastify-socket.io` plugin integrates cleanly

## Consequences

- Team must learn Fastify plugin model (different from Express middleware model)
- Less ecosystem documentation than Express, but documentation quality is high
- `ajv` JSON schema validation is separate from Zod — we use Zod for business logic validation and Fastify's built-in ajv for route-level input schema

## Alternatives Considered

| Option | Reason Rejected |
| --------- | ---------------------------------------------- |
| Express | Slower, no built-in schema validation, worse TypeScript DX |
| NestJS | Too much magic and overhead for a modular monolith at this scale |
| Hono | Excellent but less Socket.IO integration; edge-first design not needed here |
