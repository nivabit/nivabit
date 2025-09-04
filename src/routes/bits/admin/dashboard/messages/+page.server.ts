import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const api = new ApiService(fetch);

	try {
		const contact = await api.get('/contact');

		return { contact };
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		return { userData: null, error: 'Failed to fetch user data' };
	}
};
