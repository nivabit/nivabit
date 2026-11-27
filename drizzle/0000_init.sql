DO $$ BEGIN
 CREATE TYPE "public"."ArticleStatus" AS ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."BookingStatus" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Admin" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"phone" text NOT NULL,
	"resetToken" text,
	"resetTokenExp" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Article" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"categories" text[],
	"status" "ArticleStatus" DEFAULT 'DRAFT' NOT NULL,
	"publishDate" timestamp,
	"tags" text[],
	"featuredImage" text,
	"seoTitle" text NOT NULL,
	"seoDescription" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"authorId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "slug" text;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Booking" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"date" text NOT NULL,
	"timeSlot" text NOT NULL,
	"timezone" text DEFAULT 'Africa/Lagos' NOT NULL,
	"notes" text,
	"status" "BookingStatus" DEFAULT 'CONFIRMED' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Contact" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"services" text,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text,
	"isread" boolean DEFAULT false NOT NULL,
	"isreadAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NewsletterBroadcast" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"totalRecipients" integer DEFAULT 0 NOT NULL,
	"sentCount" integer DEFAULT 0 NOT NULL,
	"failedCount" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'QUEUED' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PlatformMetric" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"change" text,
	"category" text DEFAULT 'growth' NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_Admin_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."Admin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_phone_key" ON "Admin" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "PlatformMetric_key_key" ON "PlatformMetric" USING btree ("key");
