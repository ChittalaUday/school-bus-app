# Deployment Architecture

## Infrastructure Overview

Single VPS deployment. No Kubernetes. No multi-region.

```
Internet
    │
    ▼
┌──────────────────────────────────────────────────────┐
│                    VPS (Ubuntu)                       │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Nginx (ports 80, 443)              │ │
│  │  SSL termination via Let's Encrypt              │ │
│  │                                                 │ │
│  │  api.govexa.com     ──▶  :3000 (Fastify API)   │ │
│  │  app.govexa.com     ──▶  :3001 (Next.js Web)   │ │
│  │  grafana.govexa.com ──▶  :3100 (Grafana)       │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌──────────────┐  ┌─────────────────────────────┐  │
│  │  Fastify API │  │      Next.js Web             │  │
│  │  :3000       │  │      :3001                   │  │
│  └──────┬───────┘  └─────────────────────────────┘  │
│         │                                             │
│  ┌──────▼──────────────────────────────────────────┐ │
│  │              Internal Network Only               │ │
│  │                                                  │ │
│  │  PostgreSQL+PostGIS  :5432                       │ │
│  │  Redis               :6379                       │ │
│  │  GraphHopper         :8989                       │ │
│  │  Prometheus          :9090                       │ │
│  │  Loki                :3100 (internal)            │ │
│  │  Grafana             :3000 (internal)            │ │
│  └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## Docker Compose Services

```yaml
services:
  nginx:            # Reverse proxy
  api:              # Fastify backend
  web:              # Next.js frontend
  postgres:         # PostgreSQL + PostGIS
  redis:            # Redis
  graphhopper:      # Routing engine (existing setup)
  prometheus:       # Metrics collection
  loki:             # Log aggregation
  promtail:         # Log shipper
  grafana:          # Dashboards
```

## Network Security

- Only Nginx is exposed to the internet (ports 80, 443)
- All internal services communicate on Docker internal network
- PostgreSQL, Redis, GraphHopper have no public ports
- Grafana accessible only via authenticated Nginx proxy

## CI/CD Pipeline (GitHub Actions)

```
Push to main
  │
  ├── test job
  │     ├── pnpm install
  │     ├── type check
  │     ├── lint
  │     └── run tests
  │
  ├── build job (on test pass)
  │     ├── docker build api
  │     ├── docker build web
  │     └── push to registry
  │
  └── deploy job (on build pass)
        ├── SSH to VPS
        ├── docker-compose pull
        ├── docker-compose up -d
        └── run migrations (prisma migrate deploy)
```

## Environment Variables

Managed in three places:

| Environment | Source |
| ----------- | ------------------------------------------ |
| Local dev | `.env.local` (gitignored) |
| CI/CD | GitHub Actions secrets |
| Production | VPS `.env` file (managed manually, gitignored) |

Never commit `.env` files. Never hardcode secrets.

## Rollback Procedure

```bash
# Quick rollback: restart previous container
docker-compose down
docker tag registry/govexa-api:previous registry/govexa-api:latest
docker-compose up -d

# Full rollback via git
git revert <commit-sha>
git push origin main
# CI/CD redeploys automatically
```

## Backup Strategy

See [operations/backups.md](../operations/backups.md).
