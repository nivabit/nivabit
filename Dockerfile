# syntax=docker/dockerfile:1
FROM oven/bun:1-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock* package-lock.json* ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install

# Development stage (used for local development with live reload / HMR)
FROM deps AS dev

WORKDIR /app

COPY . .

ENV NODE_ENV=development
ENV PORT=3000

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN mkdir -p /app/uploads && sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]

# Production builder
FROM deps AS builder

WORKDIR /app

COPY . .
RUN bun --bun ./node_modules/.bin/vite build

# Production runner
FROM oven/bun:1-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/bun.lock ./bun.lock
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/lib/server/db ./src/lib/server/db
COPY --from=builder /app/static ./static
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN mkdir -p /app/uploads && sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
