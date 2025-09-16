import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';
import { fail, type Actions } from '@sveltejs/kit';

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


export const actions: Actions = {
	send: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();

		// Get fields from formData
		const subject = formData.get('subject')?.toString();
    	const message = formData.get('message')?.toString();

		if (!subject || !message) {
			return fail(400, {
				success: false,
				errors: { message: 'Subject and message are required'  },
				values: { subject, message } 
			});
		}

		try {			
			const api = new ApiService(fetch, cookies, '/api');

			// ✅ Send article to backend
			const res: any = await api.post('/newsletter/admin/send', {
				body: formData,
				auth: true,
			});

			return { success: true, url: '/bits/admin/dashboard/articles' };
		} catch (err: any) {
			return fail(400, {
				success: false,
				errors: { message: err.message || 'Server error. Please try again.' },
				values: { subject, message } 
			});
		}
	},



	deleteSubscriber: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, {
				success: false,
				errors: { email: 'ID is required'  },
				values: { id } 
			});
		}

		try {
			const api = new ApiService(fetch, cookies, '/api');

			// Send DELETE request with JSON body containing the id
			const res = await api.delete(`/newsletter/admin/unsubscribe/${id}`, { auth: true });

			return { success: true, message: 'Subscriber deleted successfully' };
		} catch (err: any) {
			return fail(500, { success: false, error: {email: err.message || 'Server error'} });
		}
	}
};
