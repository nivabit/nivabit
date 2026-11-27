import 'dotenv/config';
import { getSqlClient } from './index.ts';
import { slugify } from '../../utils/slug.ts';

async function ensureSchema() {
	const sql = getSqlClient();

	try {
		await sql.unsafe(`
			DO $$ BEGIN
				CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED');
			EXCEPTION
				WHEN duplicate_object THEN NULL;
			END $$;

			DO $$ BEGIN
				CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
			EXCEPTION
				WHEN duplicate_object THEN NULL;
			END $$;

			CREATE TABLE IF NOT EXISTS "Admin" (
				"id" text PRIMARY KEY NOT NULL,
				"email" text NOT NULL,
				"passwordHash" text NOT NULL,
				"name" text NOT NULL,
				"role" text NOT NULL,
				"phone" text NOT NULL,
				"resetToken" text,
				"resetTokenExp" timestamp,
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" timestamp NOT NULL
			);
			CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin" ("email");
			CREATE UNIQUE INDEX IF NOT EXISTS "Admin_phone_key" ON "Admin" ("phone");

			CREATE TABLE IF NOT EXISTS "Article" (
				"id" text PRIMARY KEY NOT NULL,
				"slug" text,
				"title" text NOT NULL,
				"excerpt" text NOT NULL,
				"content" text NOT NULL,
				"categories" text[],
				"status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
				"publishDate" timestamp,
				"tags" text[],
				"featuredImage" text,
				"seoTitle" text NOT NULL,
				"seoDescription" text NOT NULL,
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" timestamp NOT NULL,
				"views" integer NOT NULL DEFAULT 0,
				"authorId" text NOT NULL REFERENCES "Admin"("id")
			);
			ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "slug" text;
			CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article" ("slug");

			CREATE TABLE IF NOT EXISTS "Contact" (
				"id" text PRIMARY KEY NOT NULL,
				"name" text NOT NULL,
				"services" text,
				"email" text NOT NULL,
				"subject" text NOT NULL,
				"message" text,
				"isread" boolean NOT NULL DEFAULT false,
				"isreadAt" timestamp,
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
			);

			CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
				"id" text PRIMARY KEY NOT NULL,
				"email" text NOT NULL,
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
			CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber" ("email");

			CREATE TABLE IF NOT EXISTS "NewsletterBroadcast" (
				"id" text PRIMARY KEY NOT NULL,
				"subject" text NOT NULL,
				"totalRecipients" integer NOT NULL DEFAULT 0,
				"sentCount" integer NOT NULL DEFAULT 0,
				"failedCount" integer NOT NULL DEFAULT 0,
				"status" text NOT NULL DEFAULT 'QUEUED',
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"completedAt" timestamp
			);

			CREATE TABLE IF NOT EXISTS "Booking" (
				"id" text PRIMARY KEY NOT NULL,
				"firstName" text NOT NULL,
				"lastName" text NOT NULL,
				"email" text NOT NULL,
				"phone" text NOT NULL,
				"date" text NOT NULL,
				"timeSlot" text NOT NULL,
				"timezone" text NOT NULL DEFAULT 'Africa/Lagos',
				"notes" text,
				"status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" timestamp NOT NULL
			);

			CREATE TABLE IF NOT EXISTS "PlatformMetric" (
				"id" text PRIMARY KEY NOT NULL,
				"key" text NOT NULL,
				"label" text NOT NULL,
				"value" text NOT NULL,
				"change" text,
				"category" text NOT NULL DEFAULT 'growth',
				"updatedAt" timestamp NOT NULL,
				"createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
			CREATE UNIQUE INDEX IF NOT EXISTS "PlatformMetric_key_key" ON "PlatformMetric" ("key");
		`);

		// Backfill slugs for any existing articles missing one
		const missingSlugs = await sql<{ id: string; title: string }[]>`
			SELECT "id", "title" FROM "Article" WHERE "slug" IS NULL OR "slug" = ''
		`;
		for (const row of missingSlugs) {
			const base = slugify(row.title) || row.id.slice(0, 8);
			let candidate = base;
			let suffix = 2;
			while (true) {
				const existing = await sql<{ id: string }[]>`
					SELECT "id" FROM "Article" WHERE "slug" = ${candidate} AND "id" != ${row.id} LIMIT 1
				`;
				if (existing.length === 0) break;
				candidate = `${base}-${suffix++}`;
			}
			await sql`UPDATE "Article" SET "slug" = ${candidate} WHERE "id" = ${row.id}`;
		}

		console.log('Database schema verified ✅');
	} finally {
		await sql.end();
	}
}

ensureSchema().catch((err) => {
	console.error('[ensure-schema error]:', err);
	process.exit(1);
});
