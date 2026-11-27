#!/bin/sh
set -e

echo "==> Ensuring Drizzle database schema with Bun..."
bun src/lib/server/db/ensure-schema.ts

if [ "$NODE_ENV" = "development" ]; then
    bunx drizzle-kit push --force || true
elif [ -f "./drizzle/meta/_journal.json" ]; then
    bunx drizzle-kit migrate
fi

echo "==> Seeding database with Bun..."
bun src/lib/server/db/seed.ts || echo "==> Seeding completed or skipped."

if [ "$NODE_ENV" = "development" ]; then
    echo "==> Starting Nivabit in DEVELOPMENT mode with Live HMR on port ${PORT:-3000}..."
    exec bun run dev --host 0.0.0.0 --port ${PORT:-3000}
else
    echo "==> Starting Nivabit application in PRODUCTION mode on port ${PORT:-3000}..."
    exec bun build/index.js
fi
