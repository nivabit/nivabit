import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { ApiService } from '$lib/services/ApiService';

const forgotSchema = z.object({
	email: z.string().email('Invalid email address')
});

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	forgotPassword: async ({ request, fetch, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parsed = forgotSchema.safeParse(formData);

		if (!parsed.success) {
			const errors: Record<string, string> = {};
			parsed.error.errors.forEach((err) => {
				errors[err.path.join('.')] = err.message;
			});
			return fail(400, { success: false, errors, values: formData });
		}

		try {
			const api = new ApiService(fetch, cookies, '/api');

			// Call backend API to send reset email
			const res: any = await api.post('/auth/forgot-password', {
				body: parsed.data
			});

			if (!res?.success) {
				return fail(400, {
					success: false,
					errors: { errors: res?.message || 'Failed to send reset email' }
				});
			}

			return { success: true };
		} catch (err: any) {
			return fail(500, {
				success: false,
				errors: { errors: err.message || 'Server error. Please try again.' }
			});
		}
	}
};
