#!/bin/bash
set -e  # Detener en cualquier error

# 1. Start DB container
echo "Starting database container..."
cd "$(dirname "$0")/dev-tools/levely-db"
docker compose up -d --build

# 2. Detect container name automatically
CONTAINER_NAME=$(docker compose ps -q levely-db)

# 3. Wait for database
echo "Waiting for the database to be ready..."
until docker exec "$CONTAINER_NAME" pg_isready -U postgres >/dev/null 2>&1; do
  sleep 2
done
echo "Database is ready."

# 4. Run Prisma levely-db push
echo "Running Prisma migrations..."
cd ../../
bun prisma db push

# 5. Seeding
echo "Seeding database..."
node prisma/seed/init.js

echo "Finished successfully."
