# ADR-004: GraphHopper as Routing Engine

**Status:** Accepted
**Date:** 2026-06-19

## Context

The application needs routing capabilities: calculating routes between bus stops, computing ETAs, detecting route deviations, and optimizing stop sequences. We evaluated two open-source self-hosted routing engines against our requirements.

## Decision

Use **GraphHopper** as the routing engine, self-hosted with the Hyderabad OSM dataset.

## Rationale

### Why Self-Hosted

- No per-request cost (Google Maps API is expensive at scale)
- Data privacy — student/bus location data never leaves our infrastructure
- Works offline on the VPS — no external API dependency

### Why GraphHopper over OSRM

Both were set up and benchmarked (see `comparison.html`). GraphHopper was chosen because:

| Feature | GraphHopper | OSRM |
| ----------------------------- | ------------------- | ------------------- |
| Custom vehicle profiles | Yes (JSON-based) | Yes (Lua-based) |
| Bus-specific profile | Yes — `bus_hyderabad.json` | Requires Lua |
| Route Optimization API | Built-in | Requires VROOM |
| Turn-by-turn instructions | Rich detail | Basic |
| Isochrone API | Built-in | Not built-in |
| Speed on Hyderabad dataset | ~50ms | ~5ms |
| Flexibility for custom logic | High | Medium |

- **Bus profile**: `bus_hyderabad.json` already tuned for Hyderabad road network with `bus_access` encoded values
- **Route Optimization**: GraphHopper's built-in optimization API handles stop sequencing without an additional service
- **Isochrone**: Used for admin pickup zone visualization

### Why Hyderabad Dataset Only

Using `hyderabad.osm.pbf` instead of full India or Telangana dataset:
- Smaller graph = faster routing (~50ms vs ~200ms)
- All routes operate within Hyderabad city limits
- Lower RAM usage on VPS

## Setup

GraphHopper is already running at `http://localhost:8989` (internal).

Profiles available:
- `car` — standard car routing
- `bus` — bus-specific routing (restricted roads, weight limits)
- `foot` — pedestrian

CH (Contraction Hierarchies) is enabled for `car` and `bus` profiles for maximum routing speed.

## Consequences

- GraphHopper requires ~1–2GB RAM for the Hyderabad graph with CH
- Graph must be rebuilt if OSM data is updated (rerun setup scripts)
- Route Optimization API is slower than pure routing (~500ms for 20 stops) — run async via BullMQ, not inline in API requests

## Alternatives Considered

| Option | Reason Rejected |
| --------------- | ---------------------------------------------- |
| Google Maps API | Cost, data privacy |
| OSRM | Less feature-rich for our use case (see table above) |
| Valhalla | More complex setup; less documentation |
| OpenRouteService | External dependency; self-hosted version complex |
