# Incident Response

## Severity Levels

| Level | Definition | Response Time |
| ----- | ---------------------------------------------------- | ------------- |
| P1 | System down, data loss, security breach | Immediate |
| P2 | Major feature broken, degraded for all users | 30 minutes |
| P3 | Minor feature broken, workaround available | Next business day |

---

## P1 Response Steps

1. **Acknowledge** — Post in Telegram ops channel: "Investigating [issue] at [time]"
2. **Assess** — Check Grafana dashboards. Is it API, database, Redis, or infrastructure?
3. **Contain** — If data integrity at risk, take API offline rather than serve corrupt data
4. **Fix or Rollback** — Apply hotfix or roll back to last known good container
5. **Validate** — Confirm system healthy via health check + manual smoke test
6. **Post-mortem** — Write incident doc within 24 hours (see template below)

---

## Common Scenarios

### API Down (no health check response)

```bash
# Check container status
docker ps -a

# Check API logs
docker logs govexa-api --tail=200

# Restart API container
docker-compose restart api

# If still down, redeploy
docker-compose pull api
docker-compose up -d api
```

### Database Connection Errors

```bash
# Check PostgreSQL container
docker logs govexa-postgres --tail=100

# Check connection count (may be exhausted)
docker exec govexa-postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Restart if needed
docker-compose restart postgres
```

### Redis Down

```bash
docker logs govexa-redis --tail=100
docker-compose restart redis
# Note: BullMQ jobs will fail until reconnected; retry is automatic
```

### GraphHopper Down

```bash
docker logs graphhopper --tail=100
docker-compose restart graphhopper
# Note: ETA recalculation jobs will queue and retry; tracking still works
```

### Location Updates Stopped (bus appears frozen on map)

1. Check if driver app is running and has GPS permission
2. Check tracking endpoint health: `GET /api/health`
3. Check Redis: `redis-cli HGETALL bus:{busId}` — is TTL expired?
4. Check Socket.IO connections in Grafana

---

## Post-Mortem Template

```markdown
# Incident Report: [Title]

**Date:** 2026-06-19
**Duration:** 14:30 – 15:15 (45 min)
**Severity:** P1
**Impact:** All parents unable to track buses for 45 minutes

## Timeline

- 14:30 — Telegram alert fired: API error rate > 5%
- 14:35 — Engineer acknowledged, began investigation
- 14:40 — Root cause identified: Redis OOM killed
- 14:50 — Redis restarted, connections restored
- 15:15 — All services validated healthy

## Root Cause

Redis ran out of memory due to location_history keys not having TTL set.

## Resolution

Restarted Redis. Added TTL to all location cache keys.

## Follow-up Tickets

- GOV-789: Add TTL to all Redis keys — P1
- GOV-790: Add Redis memory alert to Grafana — P2
```
