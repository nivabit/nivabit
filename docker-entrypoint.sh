#!/bin/sh
set -e

echo "==> Running Drizzle database migrations with Bun..."
bun src/lib/server/db/migrate.ts

echo "==> Seeding database with Bun..."
bun src/lib/server/db/seed.ts || echo "==> Seeding completed or skipped."

if [ "$NODE_ENV" = "development" ]; then
    echo "==> Starting Nivabit in DEVELOPMENT mode with Live HMR on port ${PORT:-3000}..."
    exec bun run dev --host 0.0.0.0 --port ${PORT:-3000}
else
    echo "==> Starting Nivabit application in PRODUCTION mode on port ${PORT:-3000}..."
    exec bun build/index.js
fi
