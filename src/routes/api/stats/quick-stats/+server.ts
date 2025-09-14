import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { requireUser } from '$lib/server/auth';
import { getDateRanges } from '$lib/utils/date';

export const GET: RequestHandler = async (event) => {
	// ✅ Only logged-in admins can access
	const admin =  await requireUser(event);

	if (!admin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { startOfWeek, startOfMonth } = getDateRanges();

	// Count articles uploaded this week
	const articlesThisWeek = await prisma.article.count({
		where: {
			createdAt: {
				gte: startOfWeek
			},
			status: 'PUBLISHED'
		}
	});

	// Count articles uploaded this month
	const articlesThisMonth = await prisma.article.count({
		where: {
			createdAt: {
				gte: startOfMonth
			},
			status: 'PUBLISHED'
		}
	});

	// Sum total article views this month
	const totalViewsThisMonth = await prisma.article.aggregate({
		_sum: {
			views: true
		},
		where: {
			createdAt: {
				gte: startOfMonth
			},
			status: 'PUBLISHED'
		}
	});

	return json({
		articlesThisWeek,
		articlesThisMonth,
		totalViewsThisMonth: totalViewsThisMonth._sum.views || 0
	});
};
