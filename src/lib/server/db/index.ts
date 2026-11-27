import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

declare global {
	var __nivabitSql: ReturnType<typeof postgres> | undefined;
	var __nivabitDb: PostgresJsDatabase<typeof schema> | undefined;
}

function sanitizeDatabaseUrl(rawUrl: string): string {
	try {
		const url = new URL(rawUrl);
		url.searchParams.delete('schema');
		return url.toString();
	} catch {
		return rawUrl;
	}
}

const rawConnectionString = process.env.DATABASE_URL;

if (!rawConnectionString) {
	throw new Error('DATABASE_URL environment variable is not set');
}

const connectionString = sanitizeDatabaseUrl(rawConnectionString);

export const sqlClient = globalThis.__nivabitSql ?? postgres(connectionString);
export const db = globalThis.__nivabitDb ?? drizzle(sqlClient, { schema });

if (process.env.NODE_ENV !== 'production') {
	globalThis.__nivabitSql = sqlClient;
	globalThis.__nivabitDb = db;
}

export * from './schema.ts';
