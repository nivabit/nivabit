import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ApiService } from '$lib/services/ApiService';
import { articleSchema } from '$lib/validation/articleSchema';
import type { Cookies } from '@sveltejs/kit';
import {
	ACCEPTED_IMAGE_TYPES,
	IMAGE_MAX_FILE_SIZE_BYTES,
	IMAGE_MAX_FILE_SIZE_MB
} from '$lib/constants/imageLimit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/bits/admin/auth/login');
	}
	return {};
};

export const actions: Actions = {
	create: async ({ request, cookies, fetch }) => {
		const rawFormData = await request.formData();

		// Get fields from formData
		const title = rawFormData.get('title')?.toString() || '';
		const excerpt = rawFormData.get('excerpt')?.toString() || '';
		const content = rawFormData.get('content')?.toString() || '';
		const status = rawFormData.get('status')?.toString() || 'Draft';
		const seoTitle = rawFormData.get('seoTitle')?.toString() || '';
		const seoDescription = rawFormData.get('seoDescription')?.toString() || '';
		const featuredImage = rawFormData.get('featuredImage') as File | null;

		// Get all tags/categories (can be multiple)
		const tags = rawFormData.getAll('tags').map((t) => t.toString());
		const categories = rawFormData.getAll('categories').map((c) => c.toString());

		const formData = {
			title,
			excerpt,
			status,
			seoTitle,
			seoDescription,
			tags,
			categories,
			content
		};

		// ✅ Validate the serializable fields
		const parsed = articleSchema.safeParse(formData);
		if (!parsed.success) {
			const errors: Record<string, string> = {};
			parsed.error.errors.forEach((err) => {
				errors[err.path.join('.')] = err.message;
			});

			// ✅ Do NOT return the file object
			return fail(400, { success: false, errors, values: formData });
		}

		// ✅ Conditionally validate image
		if (status === 'PUBLISHED') {
			// Image is required
			if (!featuredImage || featuredImage.size === 0) {
				return fail(400, {
					success: false,
					errors: { featuredImage: 'Featured image is required' },
					values: formData
				});
			}
		}

		// ✅ If image is present (whether draft or published), validate it
		if (featuredImage && featuredImage.size > 0) {
			if (!ACCEPTED_IMAGE_TYPES.includes(featuredImage.type)) {
				return fail(400, {
					success: false,
					errors: {
						featuredImage: `Unsupported image type. Accepted formats: ${ACCEPTED_IMAGE_TYPES.join(', ')}.`
					},
					values: formData
				});
			}

			if (featuredImage.size > IMAGE_MAX_FILE_SIZE_BYTES) {
				return fail(400, {
					success: false,
					errors: {
						featuredImage: `Image too big. Max size allowed is ${IMAGE_MAX_FILE_SIZE_MB}MB.`
					},
					values: formData
				});
			}
		}

		try {
			const api = new ApiService(fetch, cookies, '/api');

			// ✅ Send article to backend
			const res: any = await api.post('/articles', {
				body: rawFormData,
				auth: true
			});

			if (!res?.id) {
				return fail(400, {
					success: false,
					errors: { root: res?.message || 'Failed to create article' },
					values: formData
				});
			}

			return { success: true, url: '/bits/admin/dashboard/articles' };
		} catch (err: any) {
			return fail(400, {
				success: false,
				errors: { root: err.message || 'Server error. Please try again.' },
				values: formData
			});
		}
	}
};
