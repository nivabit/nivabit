import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';

export const load: PageServerLoad = async ({ fetch, params, depends }) => {
	const { id } = params;

	depends(`data:articles:${id}`); // 👈 this tells SvelteKit to re-run when `id` changes

	const api = new ApiService(fetch);

	try {
		const singleArticles = await api.get(`/articles/${id}`);
		const articles = await api.get('/articles/list');
		await api.patch(`/articles/${id}`);

		return { articles, singleArticles };
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		return { userData: null, error: 'Failed to fetch user data' };
	}
};
