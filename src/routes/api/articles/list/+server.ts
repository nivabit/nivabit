import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async () => {
	const articles = await prisma.article.findMany({
		where: {
			NOT: {
				status: 'DRAFT'
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return json(articles);
};
