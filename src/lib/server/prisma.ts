import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var prisma` in dev mode without TS error
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
