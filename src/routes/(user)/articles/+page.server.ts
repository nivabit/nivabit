import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';

export const load: PageServerLoad = async ({fetch}) => {
	const api = new ApiService(fetch);

	try {
		const articles = await api.get('/articles');
		return { articles };
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		return { userData: null, error: 'Failed to fetch user data' };
	}
};
