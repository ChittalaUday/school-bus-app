# ADR-005: Socket.IO + Redis for Realtime

**Status:** Accepted
**Date:** 2026-06-19

## Context

Parents need to see their child's bus position update in real time without polling. Drivers broadcast GPS coordinates every few seconds. The system must push these updates to multiple connected parents simultaneously.

## Decision

Use **Socket.IO** for realtime communication and **Redis** (HSET) for current bus position storage.

## Rationale

### Socket.IO

- **Room-based broadcasting**: Natural fit for `trip:{id}` rooms — only parents on a specific trip receive updates for that bus
- **Fallback**: Automatic fallback to long-polling for mobile networks in Hyderabad that may block WebSocket upgrades
- **React Native support**: `socket.io-client` has first-class React Native support
- **Auth integration**: Middleware hook on connection for JWT validation before joining rooms

### Redis for Current Position

- Sub-millisecond reads (`HGET bus:{id} lat`) — essential for serving current position on socket connect
- Shared between API and background workers without coupling
- TTL on keys detects stale/offline buses (no update in 5 minutes = bus is offline)

### Why Not Server-Sent Events (SSE)

- SSE is server-to-client only — driver broadcasting (client-to-server) still needs REST
- No room/subscription model — would require per-client filtering logic
- React Native SSE support is inconsistent

### Why Not Raw WebSockets

- No room management, auth hooks, or reconnect handling
- Socket.IO adds ~30KB to bundle but saves significant infrastructure code

## Consequences

- Socket.IO Redis adapter needed if we ever scale to multiple API instances — pre-planned but not needed now
- Mobile clients must handle reconnect gracefully (network switches between WiFi/cellular are common in Hyderabad traffic)
- Socket.IO version must be kept consistent between server (`socket.io`) and all clients (`socket.io-client`)

## Alternatives Considered

| Option | Reason Rejected |
| --------- | ---------------------------------------------- |
| SSE | Server-to-client only; no room model |
| Raw WebSockets | No auth hooks, room management, reconnect |
| Pusher/Ably | External SaaS cost and dependency |
| Firebase Realtime DB | Vendor lock-in; cost at scale |
