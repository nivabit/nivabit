import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, type Redirect } from '@sveltejs/kit';
import { loginSchema } from '$lib/validation/validation';
import { ApiService } from '$lib/services/ApiService';
import {
	clearAuthCookie,
	clearRefreshCookie,
	clearUserCookie,
	setAuthCookie,
	setUserCookie
} from '$lib/utils/auth'; // helper for cookies

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		// already logged in
		throw redirect(302, '/bits/admin/dashboard');
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies, fetch }) => {
		const formData = Object.fromEntries(await request.formData());

		// ✅ Validate with zod
		const parsed = loginSchema.safeParse(formData);
		if (!parsed.success) {
			const errors: Record<string, string> = {};
			parsed.error.errors.forEach((err) => {
				errors[err.path.join('.')] = err.message;
			});
			return fail(400, { success: false, errors, values: formData });
		}

		try {
			// ✅ Call backend API
			const api = new ApiService(fetch, cookies, '/api');

			// ✅ Call login with body
			const res: any = await api.post('/auth/login', {
				body: parsed.data
			});

			if (!res?.accessToken) {
				return fail(401, {
					success: false,
					errors: { root: res?.message || 'Invalid credentials' },
					values: formData
				});
			}

			// ✅ Store cookie
			setAuthCookie(cookies, res.accessToken);

			// ✅ Fetch user data with token
			const user = await api.get('/auth/me', { auth: true });

			// ✅ Save user in cookie (stringify for storage)
			setUserCookie(cookies, user);
		} catch (err: any) {
			return fail(500, {
				success: false,
				errors: { errors: err.message || 'Server error. Please try again.' },
				values: formData
			});
		}
	},

	logout: async ({ cookies }) => {
		clearAuthCookie(cookies);
		clearUserCookie(cookies);
		clearRefreshCookie(cookies);

		throw redirect(302, '/bits/admin/auth/login');
	}
};
