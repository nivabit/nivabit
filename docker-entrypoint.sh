#!/bin/sh
set -e

echo "==> Running Prisma database migrations with Bun..."
bunx prisma migrate deploy

echo "==> Seeding database with Bun..."
bun prisma/seed.js || echo "==> Seeding completed or skipped."

echo "==> Starting Nivabit application with Bun on port ${PORT:-3000}..."
exec bun build/index.js

