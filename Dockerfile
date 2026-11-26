# syntax=docker/dockerfile:1
FROM oven/bun:1-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock* package-lock.json* ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install

COPY prisma ./prisma
RUN bunx prisma generate

FROM deps AS builder

COPY . .
RUN bun --bun ./node_modules/.bin/vite build

FROM oven/bun:1-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/bun.lock ./bun.lock
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --production

COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/static ./static
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN mkdir -p /app/uploads && chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
