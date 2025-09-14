import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';
import { fail, type Actions } from '@sveltejs/kit';

// Optional: Better email regex than HTML5 spec
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const load: PageServerLoad = async ({ fetch }) => {
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
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		// Check if email is valid
		if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
			return fail(400, {
				error: {email: 'Invalid email address'},
				values: {
					email
				}
			});
		}

		try {
			const api = new ApiService(fetch);
			const res: any = await api.post('/newsletter/subscribe', { body: { email } });

			if (!res?.success) {
				return fail(400, {
					success: false,
					error: res?.message || 'Subscription failed',
					values: {
						email
					}
				});
			}

			return {
				success: true,
				message: 'Subscription successful!'
			};
			
		} catch (err: any) {
			console.error('Subscription error:', err);
			return fail(500, {
				success: false,
				error: { email: err?.message || 'Server error. Please try again later.' },
				values: {
					email
				}
			});
		}
	}
};