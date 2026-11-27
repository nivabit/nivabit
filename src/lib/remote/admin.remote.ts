import { form, query, getRequestEvent } from '$app/server';
import { invalid } from '@sveltejs/kit';
import argon2 from 'argon2';
import { and, asc, count, eq, gte, sum } from 'drizzle-orm';
import {
	db,
	admins,
	articles,
	bookings,
	contacts,
	newsletterSubscribers,
	platformMetrics
} from '#lib/server/db/index.ts';
import { requireUser } from '#lib/server/auth.ts';
import { getDateRanges } from '#lib/utils/date.ts';
import { clearAllAuthCookies, setUserCookie } from '#lib/utils/auth.ts';
import { profileSchema, changePasswordSchema, updateMetricSchema } from '#lib/validation/validation.ts';

export const getDashboardStats = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	const { startOfWeek, startOfMonth } = getDateRanges();

	const [
		[totalArticlesRow],
		[totalViewsRow],
		[totalAdminsRow],
		[totalContactsRow],
		[unreadContactsRow],
		[totalBookingsRow],
		[totalSubscribersRow],
		[articlesThisWeekRow],
		[articlesThisMonthRow],
		[viewsThisMonthRow]
	] = await Promise.all([
		db.select({ value: count() }).from(articles),
		db.select({ total: sum(articles.views) }).from(articles),
		db.select({ value: count() }).from(admins),
		db.select({ value: count() }).from(contacts),
		db.select({ value: count() }).from(contacts).where(eq(contacts.isread, false)),
		db.select({ value: count() }).from(bookings),
		db.select({ value: count() }).from(newsletterSubscribers),
		db
			.select({ value: count() })
			.from(articles)
			.where(and(gte(articles.createdAt, startOfWeek), eq(articles.status, 'PUBLISHED'))),
		db
			.select({ value: count() })
			.from(articles)
			.where(and(gte(articles.createdAt, startOfMonth), eq(articles.status, 'PUBLISHED'))),
		db
			.select({ total: sum(articles.views) })
			.from(articles)
			.where(and(gte(articles.createdAt, startOfMonth), eq(articles.status, 'PUBLISHED')))
	]);

	return {
		stats: {
			totalArticles: totalArticlesRow?.value ?? 0,
			totalViews: Number(totalViewsRow?.total ?? 0),
			totalAdmins: totalAdminsRow?.value ?? 0,
			totalContacts: totalContactsRow?.value ?? 0,
			unreadContacts: unreadContactsRow?.value ?? 0,
			totalBookings: totalBookingsRow?.value ?? 0,
			totalSubscribers: totalSubscribersRow?.value ?? 0
		},
		quickStats: {
			articlesThisWeek: articlesThisWeekRow?.value ?? 0,
			articlesThisMonth: articlesThisMonthRow?.value ?? 0,
			totalViewsThisMonth: Number(viewsThisMonthRow?.total ?? 0)
		}
	};
});

export const getPlatformMetrics = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	let metrics = await db.select().from(platformMetrics).orderBy(asc(platformMetrics.createdAt));

	if (metrics.length === 0) {
		const defaults = [
			{ key: 'active_founders', label: 'Active Founders in Community', value: '2,500+', change: '+18% MoM', category: 'community' },
			{ key: 'validation_sprints', label: 'Validation Sprints Completed', value: '140+', change: '+12% MoM', category: 'operations' },
			{ key: 'demand_signals', label: 'Demand Signals Mined', value: '100,000+', change: '+35% MoM', category: 'intel' },
			{ key: 'pre_code_savings', label: 'Client Runway Saved ($)', value: '$1.4M+', change: '+28% YoY', category: 'impact' }
		];

		await db.insert(platformMetrics).values(defaults).onConflictDoNothing();
		metrics = await db.select().from(platformMetrics).orderBy(asc(platformMetrics.createdAt));
	}

	return metrics;
});

export const upsertPlatformMetric = form(updateMetricSchema, async (data) => {
	const event = getRequestEvent();
	await requireUser(event);

	const [metric] = await db
		.insert(platformMetrics)
		.values({
			key: data.key,
			label: data.label,
			value: data.value,
			change: data.change || '',
			category: data.category || 'growth'
		})
		.onConflictDoUpdate({
			target: platformMetrics.key,
			set: {
				label: data.label,
				value: data.value,
				change: data.change || '',
				category: data.category || 'growth',
				updatedAt: new Date()
			}
		})
		.returning();

	return { success: true, message: `Metric "${data.label}" updated.`, metric };
});

export const getAdminProfile = query(async () => {
	const event = getRequestEvent();
	const user = await requireUser(event);
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		phone: user.phone
	};
});

export const updateAdminProfile = form(profileSchema, async ({ name, phone }, issue) => {
	const event = getRequestEvent();
	const user = await requireUser(event);

	const normalizedPhone = phone?.trim() || undefined;
	if (normalizedPhone) {
		const [existing] = await db
			.select({ id: admins.id })
			.from(admins)
			.where(eq(admins.phone, normalizedPhone))
			.limit(1);
		if (existing && existing.id !== user.id) {
			return invalid(issue.phone('Phone number is already in use.'));
		}
	}

	const [updated] = await db
		.update(admins)
		.set({
			name,
			...(normalizedPhone !== undefined ? { phone: normalizedPhone } : {})
		})
		.where(eq(admins.id, user.id))
		.returning({
			id: admins.id,
			name: admins.name,
			phone: admins.phone,
			email: admins.email,
			role: admins.role
		});

	setUserCookie(event.cookies, updated);
	await getAdminProfile().refresh();

	return { success: true, message: 'Profile updated successfully.', user: updated };
});

export const changeAdminPassword = form(
	changePasswordSchema,
	async ({ _oldPassword, _newPassword }, issue) => {
		const event = getRequestEvent();
		const user = await requireUser(event);

		const valid = await argon2.verify(user.passwordHash, _oldPassword);
		if (!valid) {
			return invalid(issue._oldPassword('Invalid current password.'));
		}

		const newHash = await argon2.hash(_newPassword);
		await db.update(admins).set({ passwordHash: newHash }).where(eq(admins.id, user.id));

		clearAllAuthCookies(event.cookies);

		return {
			success: true,
			message: 'Password updated successfully.',
			redirect: '/bits/admin/auth/login'
		};
	}
);
