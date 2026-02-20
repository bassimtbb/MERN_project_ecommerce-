#!/bin/bash
# =============================================================================
# init-mongo.sh
# Runs automatically on first container startup via /docker-entrypoint-initdb.d/
# Imports JSON seed data into the MongoDB database defined by MONGO_INITDB_DATABASE.
# =============================================================================

set -e  # Exit immediately on any error

# ── Variables (injected by Docker from your environment / docker-compose) ──────
DB="${MONGO_INITDB_DATABASE}"
USER="${MONGO_INITDB_ROOT_USERNAME}"
PASS="${MONGO_INITDB_ROOT_PASSWORD}"
SOURCE_DIR="/import/datasource"

echo "======================================================"
echo " MongoDB Seed Script Starting"
echo " Target database : $DB"
echo " Source directory: $SOURCE_DIR"
echo "======================================================"

# ── Helper function ────────────────────────────────────────────────────────────
import_collection() {
  local collection="$1"
  local file="$SOURCE_DIR/${collection}.json"

  if [ -f "$file" ]; then
    echo ""
    echo "→ Importing '$collection' from $file ..."
    mongoimport \
      --host localhost \
      --authenticationDatabase admin \
      --username  "$USER" \
      --password  "$PASS" \
      --db        "$DB" \
      --collection "$collection" \
      --file      "$file" \
      --jsonArray \
      --drop          # Drop & recreate so you always get clean seed data
    echo "  ✓ '$collection' imported successfully."
  else
    echo "  ⚠ Warning: $file not found — skipping '$collection'."
  fi
}

# ── Import each collection ─────────────────────────────────────────────────────
import_collection "products"
import_collection "users"

echo ""
echo "======================================================"
echo " ✓ Seeding complete."
echo "======================================================"
