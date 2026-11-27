import 'dotenv/config';
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

export function getSqlClient() {
	if (globalThis.__nivabitSql) return globalThis.__nivabitSql;

		const rawConnectionString = process.env.DATABASE_URL;
		if (!rawConnectionString) {
			throw new Error('DATABASE_URL environment variable is not set');
		}

		const client = postgres(sanitizeDatabaseUrl(rawConnectionString));
		globalThis.__nivabitSql = client;
		return client;
	}

	export function getDb(): PostgresJsDatabase<typeof schema> {
		if (globalThis.__nivabitDb) return globalThis.__nivabitDb;

			const instance = drizzle(getSqlClient(), { schema });
			globalThis.__nivabitDb = instance;
			return instance;
		}

		export const db: PostgresJsDatabase<typeof schema> = new Proxy(
			{} as PostgresJsDatabase<typeof schema>,
			{
				get(_target, prop, receiver) {
					const instance = getDb();
					const value = Reflect.get(instance, prop, receiver);
					return typeof value === 'function' ? value.bind(instance) : value;
				}
			}
		);

		export const sqlClient = {
			end: () => globalThis.__nivabitSql?.end() ?? Promise.resolve()
		};

		export * from './schema.ts';
