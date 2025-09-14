import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { authorize, requireUser } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
	const admin = await requireUser(event);
	
	if (!admin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Fetch aggregated stats in parallel
		const [totalArticles, totalViews, totalAdmins, totalContacts, unreadContacts] =
			await Promise.all([
				prisma.article.count(),
				prisma.article.aggregate({
					_sum: { views: true }
				}),
				prisma.admin.count(),
				prisma.contact.count(),
				prisma.contact.count({ where: { isread: false } })
			]);

		return json({
			success: true,
			data: {
				totalArticles,
				totalViews: totalViews._sum.views ?? 0,
				totalAdmins,
				totalContacts,
				unreadContacts
			}
		});
	} catch (error) {
		console.error('Stats error:', error);
		return json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
	}
};
