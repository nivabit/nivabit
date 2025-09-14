import type { Actions, PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { clearAllAuthCookies, setUserCookie } from '$lib/utils/auth';
import { passwordRequirements } from '$lib/constants/passwordRequirements';

// 📌 Validation Schemas
const phoneRegex = /^\+?[0-9\-\s()]{7,20}$/;

const profileSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long').trim(),
	phone: z
		.string()
		.regex(phoneRegex, 'Invalid phone number')
		.or(z.literal('').transform(() => undefined)) // allow empty phone
});

const passwordSchema = z.object({
	oldPassword: z.string().min(6, 'Old password must be at least 8 characters').max(100, 'Password too long'),
	newPassword: z
		.string()
		.min(8, 'New password must be at least 8 characters')
		.max(100, 'Password too long'),
	confirmPassword: z.string().min(8, 'confirm password is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'] 
}).refine((data) => {
	const strength = passwordRequirements(data.newPassword);
	return (
		strength.hasUpperCase &&
		strength.hasLowerCase &&
		strength.hasNumbers &&
		strength.hasSpecialChar
	);
}, {
	message: 'Password must include uppercase, lowercase, number, and special character',
	path: ['newPassword']
});;


export const load: PageServerLoad = async ({ locals }) => {
	try {
		return { user: locals.user };
	} catch (error) {
		console.error('Failed to fetch user data:', error);
		return { userData: null, error: 'Failed to fetch user data' };
	}
};



export const actions: Actions = {
	updateProfile: async ({ request, cookies, fetch }) => {
		const data = await request.formData();
		const raw = { name: data.get('name'), phone: data.get('phone') };

		// ✅ Validate with Zod
		const parsed = profileSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(401, {
				success: false,
				error: parsed.error.flatten().fieldErrors,
				values: raw
			});
		}

		try {
			const api = new ApiService(fetch, cookies);
			const res = await api.patch('/admin/update-profile', {
				auth: true,
				body: parsed.data
			});

			const data = await api.get('/auth/me', {
				auth: true,
				body: parsed.data
			});

			// ✅ Save user in cookie (stringify for storage)
			setUserCookie(cookies, data);
			
			return { success: true,  };
		} catch (err: any) {
			return fail(401, {
				success: false,
				error: {name: err.message || 'Failed to update profile'},
				values: raw
			});
		}
	},

	changePassword: async ({ request, cookies, fetch }) => {
		const data = await request.formData();
		const raw = { oldPassword: data.get('oldPassword'), newPassword: data.get('newPassword'), confirmPassword: data.get('confirmPassword') };

		// ✅ Validate with Zod
		const parsed = passwordSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(401, {
				success: false,
				error: parsed.error.flatten().fieldErrors,
				values: raw
			});
		}

		try {
			// ✅ Call backend API
			const api = new ApiService(fetch, cookies);
			await api.patch('/admin/change-password', {
				auth: true,
				body: parsed.data
			});
			clearAllAuthCookies(cookies);
			
			return { success: true, redirect: '/bits/admin/auth/login' };
		} catch (err: any) {
			return fail(401, {
				success: false,
				error: {oldPassword: err.message || 'Failed to change password'},
				values: raw
			});
		}
	}
};