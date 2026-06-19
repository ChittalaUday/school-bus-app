#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/data"
PBF="$DATA_DIR/hyderabad.osm.pbf"
OSRM="$DATA_DIR/hyderabad.osrm"

echo "=== OSRM Setup for Hyderabad ==="

# Check if PBF exists
if [[ ! -f "$PBF" ]]; then
  echo "ERROR: $PBF not found."
  echo "Run this from the osrm/ directory and ensure hyderabad.osm.pbf is in data/"
  exit 1
fi

# Step 1: Preprocess (only if .osrm doesn't exist or --force passed)
if [[ ! -f "$OSRM" ]] || [[ "$1" == "--force" ]]; then
  echo ""
  echo ">>> Step 1: Extracting road network..."
  docker run --rm \
    -v "$DATA_DIR:/data" \
    osrm/osrm-backend:latest \
    osrm-extract -p /data/hyderabad.lua /data/hyderabad.osm.pbf

  echo ""
  echo ">>> Step 2: Partitioning graph (MLD)..."
  docker run --rm \
    -v "$DATA_DIR:/data" \
    osrm/osrm-backend:latest \
    osrm-partition /data/hyderabad.osrm

  echo ""
  echo ">>> Step 3: Customizing weights..."
  docker run --rm \
    -v "$DATA_DIR:/data" \
    osrm/osrm-backend:latest \
    osrm-customize /data/hyderabad.osrm

  echo ""
  echo "Preprocessing complete!"
else
  echo "Preprocessed data already exists. Use --force to reprocess."
fi

# Step 4: Start OSRM server
echo ""
echo ">>> Starting OSRM routing server on http://localhost:5001 ..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d osrm-backend

echo ""
echo "=== OSRM is running ==="
echo "  Health:  http://localhost:5001/health"
echo "  Route:   http://localhost:5001/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson"
echo "  Example: http://localhost:5001/route/v1/driving/78.4867,17.3850;78.5480,17.4399?overview=full&geometries=geojson"
