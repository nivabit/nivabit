import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { and, eq, isNull, ne, or } from 'drizzle-orm';
import { db, articles, sqlClient } from './index.ts';
import { slugify } from '../../utils/slug.ts';

async function runMigrations() {
	await migrate(db, { migrationsFolder: './drizzle' });

	// Backfill slugs for any existing articles using Drizzle ORM
	const missingSlugs = await db
		.select({ id: articles.id, title: articles.title })
		.from(articles)
		.where(or(isNull(articles.slug), eq(articles.slug, '')));

	for (const row of missingSlugs) {
		const base = slugify(row.title) || row.id.slice(0, 8);
		let candidate = base;
		let suffix = 2;

		while (true) {
			const [existing] = await db
				.select({ id: articles.id })
				.from(articles)
				.where(and(eq(articles.slug, candidate), ne(articles.id, row.id)))
				.limit(1);
			if (!existing) break;
			candidate = `${base}-${suffix++}`;
		}

		await db.update(articles).set({ slug: candidate }).where(eq(articles.id, row.id));
	}

	console.log('Drizzle migrations applied ✅');
}

runMigrations()
	.catch((err) => {
		console.error('[drizzle migrate error]:', err);
		process.exitCode = 1;
	})
	.finally(() => sqlClient.end());
