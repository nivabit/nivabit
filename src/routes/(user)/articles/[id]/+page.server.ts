import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const { id } = params;

	const api = new ApiService(fetch);

	try {
		const singleArticles = await api.get(`/articles/${id}`);
		const articles = await api.get('/articles');

		return { articles, singleArticles };
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		return { userData: null, error: 'Failed to fetch user data' };
	}
};
