import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const api = new ApiService(fetch, cookies);

	try {
		const subscribers: any = await api.get('/newsletter/admin/list', { auth: true });
		
		return {
			subscribers: subscribers?.subscribers
		};
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		return { userData: null, error: 'Failed to fetch user data' };
	}
};

