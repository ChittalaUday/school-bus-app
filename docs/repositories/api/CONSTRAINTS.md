# API Constraints — `apps/api`

---

## Performance

- Location update endpoint (`POST /tracking/location`) must respond in < 100ms (p99)
- GraphHopper route requests must be made asynchronously — never inline in a request handler
- BullMQ ETA recalculation job must complete in < 5s per trip
- Socket.IO event delivery must be < 200ms from location update receipt
- Prisma connection pool: max 10 connections (VPS RAM constraint)

## Memory

- API container memory limit: 512MB
- GraphHopper runs separately — API must not load routing data into its own process
- BullMQ workers run in-process — keep job handler memory footprint small

## Concurrency

- Assume up to 50 simultaneous active trips (Hyderabad school bus scale)
- Assume up to 500 concurrent Socket.IO connections (parents + admins)
- Location updates: up to 50 per second at peak (1 per bus per second)

## Single VPS

- No horizontal scaling in current architecture
- No distributed locks needed (single process)
- If scaling is needed in future, Redis adapter for Socket.IO is pre-planned (see ADR-005)

## GraphHopper

- Only call GraphHopper for the `bus` profile in production
- GraphHopper is internal-only — never expose its port to the internet
- Route optimization requests are slow (~500ms for 20 stops) — always async

## Database

- PostGIS spatial queries must use GiST-indexed columns — no full table spatial scans
- `location_history` table will grow large — archive rows older than 90 days (cron job)
- Never run migrations in production without a backup

## Security

- JWT secrets must be at least 32 characters
- Refresh tokens must be invalidated immediately on logout
- Rate limiting mandatory on auth endpoints (see `docs/standards/security.md`)

## No External Network Calls in Request Path

The following are forbidden in synchronous request handlers:
- GraphHopper HTTP calls
- Novu/Telegram/SMTP calls
- S3 calls (except presigned URL generation)

All external calls go through BullMQ queues.
