# API Responsibilities — `apps/api`

---

## Owns

- All business logic for the entire Govexa application
- REST API endpoints for all clients (web, mobile)
- Socket.IO server and room management
- JWT issuance, validation, and refresh token lifecycle
- All database read/write operations (via Prisma)
- All Redis read/write operations
- GraphHopper integration (routing, ETA, optimization)
- BullMQ job queue and worker execution
- Notification dispatch (Novu, Telegram, SMTP)
- S3 presigned URL generation
- Prometheus metrics endpoint
- Swagger/OpenAPI documentation

## Does NOT Own

- Frontend rendering — that is `apps/web`
- Mobile app UI — that is `apps/mobile`
- TypeScript type definitions shared with web/mobile — those live in `apps/shared`
- GraphHopper data preprocessing — that is the `graphhopper/` setup scripts
- Nginx configuration — that is `infrastructure/`
- Database schema migrations after initial setup are owned here, but must be reviewed carefully as they affect all consumers
- Monitoring dashboards — those are in `infrastructure/grafana/`

## Boundary Rules

- The API must never render HTML
- The API must never import from `apps/web` or `apps/mobile`
- The API is the single source of truth for all data — web and mobile are read/write through the API only
- The API must never expose internal service errors to clients — always map to `AppError` with a safe message
