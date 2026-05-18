#!/bin/bash
set -e

echo "Starting database container..."
cd "$(dirname "$0")/dev-tools/levely-db"
docker compose up -d --build

echo "Waiting for the database to be ready..."
until docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; do
  sleep 2
done
echo "Database is ready."

cd ../../

echo "Running Prisma migrations..."
# bun prisma db push
bunx prisma migrate dev --skip-seed

echo "Seeding database..."
bun prisma/seed.ts

echo "Finished successfully."
