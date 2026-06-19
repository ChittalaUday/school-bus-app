# ADR-003: PostgreSQL + PostGIS as Primary Database

**Status:** Accepted
**Date:** 2026-06-19

## Context

The application has strong geospatial requirements: storing bus stop locations, route geometries, querying stops within a radius, detecting when a bus enters a geofence, and storing historical bus tracks. We need a database that handles both standard relational data and geospatial data well.

## Decision

Use **PostgreSQL** as the primary database with the **PostGIS** extension for geospatial capabilities.

## Rationale

- **PostGIS**: Industry-standard spatial extension for PostgreSQL. Supports geometry types (Point, LineString, Polygon), spatial indexing (GiST), and spatial queries (`ST_DWithin`, `ST_Contains`, `ST_Distance`) needed for stop proximity and geofencing
- **Prisma ORM**: Best-in-class TypeScript ORM. Supports raw SQL for PostGIS queries where needed. Migrations tracked in version control
- **Relational fit**: The domain model (Schools → Routes → Stops → Trips → Students → Parents) is highly relational — a document database would be a poor fit
- **Historical location storage**: PostgreSQL with a time-series-style `location_history` table (bus_id, coordinates, timestamp) is sufficient at Hyderabad's school bus scale. TimescaleDB is not needed yet
- **Current location**: Redis HSET for sub-millisecond current position reads. PostgreSQL for durable history. Clear separation

## Data Split

| Data Type | Store | Reason |
| -------------------- | ---------- | -------------------------------- |
| Current bus position | Redis | Sub-millisecond reads for realtime |
| Location history | PostgreSQL | Durable, queryable for reports |
| Route geometries | PostgreSQL + PostGIS | Spatial queries, rendering |
| Stop positions | PostgreSQL + PostGIS | Proximity queries |
| All other entities | PostgreSQL | Standard relational |

## Consequences

- PostGIS queries cannot be expressed in Prisma's typed query builder — raw SQL needed for spatial operations
- Create a `PostGIS` utility module in the API for all spatial queries to keep raw SQL contained and testable
- GiST index required on all geometry columns for acceptable query performance

## Alternatives Considered

| Option | Reason Rejected |
| --------------- | ---------------------------------------------- |
| MongoDB | Weak spatial support; poor fit for relational domain |
| MySQL | PostGIS alternative (MySQL Spatial) is far less capable |
| TimescaleDB | Overkill for current scale; can migrate later if needed |
| Firebase Firestore | No spatial queries; vendor lock-in |
