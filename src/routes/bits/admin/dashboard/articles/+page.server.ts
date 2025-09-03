import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({fetch, cookies}) => {
	const api = new ApiService(fetch);
	try {
		const articles = await api.get('/articles');
        
		return { articles };
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		return { userData: null, error: 'Failed to fetch user data' };
	}
};



export const actions: Actions = {
	delete: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const id = formData.get("id") as string;

		if (!id) {
			return { success: false, error: "No article ID provided" };
		}

		const api = new ApiService(fetch, cookies);

		try {
			// ✅ Call your backend API using ApiService
			await api.delete(`/articles/${id}`, { auth: true, method: "DELETE" });
			
			return { success: true };
		} catch (error: any) {
			console.error("Delete failed:", error);
			return { success: false, error: error.message || "Failed to delete article" };
		}
	}
};
