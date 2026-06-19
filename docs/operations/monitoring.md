# Monitoring

## Stack

| Tool | Role | Port |
| ---------- | ------------------- | ------------- |
| Pino | Application logging | (stdout) |
| Promtail | Log shipper | (sidecar) |
| Loki | Log aggregation | 3100 (internal) |
| Prometheus | Metrics collection | 9090 (internal) |
| Grafana | Dashboards | 3000 (internal, proxied via Nginx) |

---

## Application Metrics (Prometheus)

Exposed at `GET /metrics` on the Fastify API.

| Metric | Type | Labels |
| ---------------------------------------- | --------- | --------------------------- |
| `http_requests_total` | Counter | method, route, status_code |
| `http_request_duration_seconds` | Histogram | method, route |
| `active_trips_total` | Gauge | — |
| `socket_connections_total` | Gauge | — |
| `bullmq_queue_depth` | Gauge | queue_name |
| `bullmq_job_duration_seconds` | Histogram | job_name |
| `graphhopper_request_duration_seconds` | Histogram | profile, endpoint |
| `location_updates_total` | Counter | bus_id |

---

## Log Structure (Pino)

All logs must be structured JSON. No `console.log`.

Required fields on every log:

```json
{
  "level": "info",
  "time": "2026-06-19T10:00:00.000Z",
  "service": "api",
  "module": "tracking",
  "requestId": "req-abc123",
  "msg": "location update received"
}
```

Business event logs also include:

```json
{
  "busId": "bus-xyz",
  "tripId": "trip-123",
  "driverId": "user-456"
}
```

---

## Grafana Dashboards

### 1. Ops Overview

- Active trips count
- Buses currently online (Redis TTL-based)
- Open alerts / errors in last 1 hour
- Socket.IO connected clients

### 2. Trip Health

- ETA accuracy (scheduled vs actual arrival time)
- Trips completed on time vs delayed
- Average trip duration by route

### 3. System Health

- API request rate and latency (p50, p95, p99)
- Error rate by route
- CPU and memory usage
- BullMQ queue depth and job failure rate
- GraphHopper response times

### 4. Security

- Failed login attempts (rate/IP)
- 401/403 error spikes

---

## Alerting (Telegram Bot)

Critical alerts fire to the ops Telegram channel:

| Condition | Severity |
| --------------------------------------- | -------- |
| API error rate > 5% for 5 min | P1 |
| Active trip with no location update > 5 min | P2 |
| BullMQ job failure rate > 10% | P2 |
| GraphHopper response time > 2s | P2 |
| PostgreSQL connection pool exhausted | P1 |
| Redis disconnected | P1 |
| Disk usage > 80% | P2 |
