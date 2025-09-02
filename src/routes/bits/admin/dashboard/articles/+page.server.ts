import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService'; // Adjust the import path to your actual ApiService file

export const load: PageServerLoad = async ({fetch, cookies}) => {
	// ✅ Initialize ApiService with event.fetch and event.cookies
	const api = new ApiService(fetch);

	// 🔐 Example: authenticated GET request
	try {
		const articles = await api.get('/articles');
        console.log(articles);
        
		return { articles };
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		return { userData: null, error: 'Failed to fetch user data' };
	}
};
