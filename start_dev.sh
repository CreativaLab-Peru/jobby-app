#!/bin/bash
set -e

echo "Starting application..."
cd "$(dirname "$0")"
bun run dev &

echo "Starting Inngest..."
npx inngest-cli@latest dev &

wait
