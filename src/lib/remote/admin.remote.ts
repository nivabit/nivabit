import { form, query, getRequestEvent } from '$app/server';
import { invalid } from '@sveltejs/kit';
import argon2 from 'argon2';
import { prisma } from '#lib/server/prisma.ts';
import { requireUser } from '#lib/server/auth.ts';
import { getDateRanges } from '#lib/utils/date.ts';
import { clearAllAuthCookies, setUserCookie } from '#lib/utils/auth.ts';
import { profileSchema, changePasswordSchema, updateMetricSchema } from '#lib/validation/validation.ts';

export const getDashboardStats = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	const { startOfWeek, startOfMonth } = getDateRanges();

	const [
		totalArticles,
		totalViewsAgg,
		totalAdmins,
		totalContacts,
		unreadContacts,
		totalBookings,
		totalSubscribers,
		articlesThisWeek,
		articlesThisMonth,
		viewsThisMonthAgg
	] = await Promise.all([
		prisma.article.count(),
		prisma.article.aggregate({ _sum: { views: true } }),
		prisma.admin.count(),
		prisma.contact.count(),
		prisma.contact.count({ where: { isread: false } }),
		prisma.booking.count(),
		prisma.newsletterSubscriber.count(),
		prisma.article.count({
			where: { createdAt: { gte: startOfWeek }, status: 'PUBLISHED' }
		}),
		prisma.article.count({
			where: { createdAt: { gte: startOfMonth }, status: 'PUBLISHED' }
		}),
		prisma.article.aggregate({
			_sum: { views: true },
			where: { createdAt: { gte: startOfMonth }, status: 'PUBLISHED' }
		})
	]);

	return {
		stats: {
			totalArticles,
			totalViews: totalViewsAgg._sum.views ?? 0,
			totalAdmins,
			totalContacts,
			unreadContacts,
			totalBookings,
			totalSubscribers
		},
		quickStats: {
			articlesThisWeek,
			articlesThisMonth,
			totalViewsThisMonth: viewsThisMonthAgg._sum.views ?? 0
		}
	};
});

export const getPlatformMetrics = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	let metrics = await prisma.platformMetric.findMany({
		orderBy: { createdAt: 'asc' }
	});

	if (metrics.length === 0) {
		const defaults = [
			{ key: 'active_founders', label: 'Active Founders in Community', value: '2,500+', change: '+18% MoM', category: 'community' },
			{ key: 'validation_sprints', label: 'Validation Sprints Completed', value: '140+', change: '+12% MoM', category: 'operations' },
			{ key: 'demand_signals', label: 'Demand Signals Mined', value: '100,000+', change: '+35% MoM', category: 'intel' },
			{ key: 'pre_code_savings', label: 'Client Runway Saved ($)', value: '$1.4M+', change: '+28% YoY', category: 'impact' }
		];

		for (const item of defaults) {
			await prisma.platformMetric.create({ data: item });
		}
		metrics = await prisma.platformMetric.findMany({ orderBy: { createdAt: 'asc' } });
	}

	return metrics;
});

export const upsertPlatformMetric = form(updateMetricSchema, async (data) => {
	const event = getRequestEvent();
	await requireUser(event);

	const metric = await prisma.platformMetric.upsert({
		where: { key: data.key },
		update: {
			label: data.label,
			value: data.value,
			change: data.change || '',
			category: data.category || 'growth'
		},
		create: {
			key: data.key,
			label: data.label,
			value: data.value,
			change: data.change || '',
			category: data.category || 'growth'
		}
	});

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
		const existing = await prisma.admin.findUnique({ where: { phone: normalizedPhone } });
		if (existing && existing.id !== user.id) {
			return invalid(issue.phone('Phone number is already in use.'));
		}
	}

	const updated = await prisma.admin.update({
		where: { id: user.id },
		data: {
			name,
			...(normalizedPhone !== undefined ? { phone: normalizedPhone } : {})
		},
		select: { id: true, name: true, phone: true, email: true, role: true }
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
		await prisma.admin.update({
			where: { id: user.id },
			data: { passwordHash: newHash }
		});

		clearAllAuthCookies(event.cookies);

		return {
			success: true,
			message: 'Password updated successfully.',
			redirect: '/bits/admin/auth/login'
		};
	}
);
