#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/data"
PBF="$DATA_DIR/hyderabad.osm.pbf"
GRAPH="$DATA_DIR/graph-cache"

echo "=== GraphHopper Setup for Hyderabad ==="

if [[ ! -f "$PBF" ]]; then
  echo "ERROR: $PBF not found."
  exit 1
fi

echo ">>> Starting GraphHopper (first run builds graph cache, takes ~2-3 min)..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d

echo ""
echo "Waiting for GraphHopper to be ready..."
until curl -sf http://localhost:8989/health > /dev/null 2>&1; do
  printf "."
  sleep 3
done

echo ""
echo "=== GraphHopper is running ==="
echo "  Health:  http://localhost:8989/health"
echo "  Route:   http://localhost:8989/route?point=17.3850,78.4867&point=17.4399,78.5480&profile=car&locale=en&calc_points=true"
echo "  UI:      http://localhost:8989"
