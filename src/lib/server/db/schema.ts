import {
	pgTable,
	pgEnum,
	text,
	integer,
	boolean,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const articleStatusEnum = pgEnum('ArticleStatus', ['DRAFT', 'PUBLISHED', 'SCHEDULED']);
export const bookingStatusEnum = pgEnum('BookingStatus', ['PENDING', 'CONFIRMED', 'CANCELLED']);

export const admins = pgTable(
	'Admin',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		email: text('email').notNull(),
		passwordHash: text('passwordHash').notNull(),
		name: text('name').notNull(),
		role: text('role').notNull(),
		phone: text('phone').notNull(),
		resetToken: text('resetToken'),
		resetTokenExp: timestamp('resetTokenExp', { mode: 'date' }),
		createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
		updatedAt: timestamp('updatedAt', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => [
		uniqueIndex('Admin_email_key').on(table.email),
		uniqueIndex('Admin_phone_key').on(table.phone)
	]
);

export const articles = pgTable(
	'Article',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		slug: text('slug'),
		title: text('title').notNull(),
		excerpt: text('excerpt').notNull(),
		content: text('content').notNull(),
		categories: text('categories').array(),
		status: articleStatusEnum('status').notNull().default('DRAFT'),
		publishDate: timestamp('publishDate', { mode: 'date' }),
		tags: text('tags').array(),
		featuredImage: text('featuredImage'),
		seoTitle: text('seoTitle').notNull(),
		seoDescription: text('seoDescription').notNull(),
		createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
		updatedAt: timestamp('updatedAt', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date()),
		views: integer('views').notNull().default(0),
		authorId: text('authorId')
			.notNull()
			.references(() => admins.id)
	},
	(table) => [uniqueIndex('Article_slug_key').on(table.slug)]
);

export const contacts = pgTable('Contact', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	services: text('services'),
	email: text('email').notNull(),
	subject: text('subject').notNull(),
	message: text('message'),
	isread: boolean('isread').notNull().default(false),
	isreadAt: timestamp('isreadAt', { mode: 'date' }),
	createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow()
});

export const newsletterSubscribers = pgTable(
	'NewsletterSubscriber',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		email: text('email').notNull(),
		createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('NewsletterSubscriber_email_key').on(table.email)]
);

export const newsletterBroadcasts = pgTable('NewsletterBroadcast', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	subject: text('subject').notNull(),
	totalRecipients: integer('totalRecipients').notNull().default(0),
	sentCount: integer('sentCount').notNull().default(0),
	failedCount: integer('failedCount').notNull().default(0),
	status: text('status').notNull().default('QUEUED'),
	createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
	completedAt: timestamp('completedAt', { mode: 'date' })
});

export const bookings = pgTable('Booking', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	firstName: text('firstName').notNull(),
	lastName: text('lastName').notNull(),
	email: text('email').notNull(),
	phone: text('phone').notNull(),
	date: text('date').notNull(),
	timeSlot: text('timeSlot').notNull(),
	timezone: text('timezone').notNull().default('Africa/Lagos'),
	notes: text('notes'),
	status: bookingStatusEnum('status').notNull().default('CONFIRMED'),
	createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
});

export const platformMetrics = pgTable(
	'PlatformMetric',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		key: text('key').notNull(),
		label: text('label').notNull(),
		value: text('value').notNull(),
		change: text('change'),
		category: text('category').notNull().default('growth'),
		updatedAt: timestamp('updatedAt', { mode: 'date' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date()),
		createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow()
	},
	(table) => [uniqueIndex('PlatformMetric_key_key').on(table.key)]
);

export const adminsRelations = relations(admins, ({ many }) => ({
	articles: many(articles)
}));

export const articlesRelations = relations(articles, ({ one }) => ({
	author: one(admins, {
		fields: [articles.authorId],
		references: [admins.id]
	})
}));

export type Admin = typeof admins.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewsletterBroadcast = typeof newsletterBroadcasts.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type PlatformMetric = typeof platformMetrics.$inferSelect;
