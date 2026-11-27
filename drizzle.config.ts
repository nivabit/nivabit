import { defineConfig } from 'drizzle-kit';

function sanitizeDatabaseUrl(rawUrl: string): string {
	try {
		const url = new URL(rawUrl);
		url.searchParams.delete('schema');
		return url.toString();
	} catch {
		return rawUrl;
	}
}

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: sanitizeDatabaseUrl(process.env.DATABASE_URL!)
	}
});
