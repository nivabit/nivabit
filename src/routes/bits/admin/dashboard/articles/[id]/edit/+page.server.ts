import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';

export const load: PageServerLoad = async ({ fetch, params }) => {
	// 👇 Get the dynamic route parameter
	const { id } = params;

	// ✅ Initialize ApiService with fetch
	const api = new ApiService(fetch);

	try {
		// 👇 Use the `id` in your API request
		const article = await api.get(`/articles/${id}`);
		console.log(article);

		return { article };
	} catch (error) {
		console.error('Failed to fetch article data:', error);
		return { article: null, error: 'Failed to fetch article data' };
	}
};
