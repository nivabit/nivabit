import type { PageServerLoad } from './$types';
import { ApiService } from '$lib/services/ApiService';
import { fail, type Actions } from '@sveltejs/kit';
import { ACCEPTED_IMAGE_TYPES, IMAGE_MAX_FILE_SIZE_BYTES, IMAGE_MAX_FILE_SIZE_MB } from '$lib/constants/imageLimit';
import { articleSchema } from '$lib/validation/articleSchema';

export const load: PageServerLoad = async ({ fetch, params }) => {
	// 👇 Get the dynamic route parameter
	const { id } = params;

	// ✅ Initialize ApiService with fetch
	const api = new ApiService(fetch);

	try {
		// 👇 Use the `id` in your API request
		const article = await api.get(`/articles/${id}`);

		return { article };
	} catch (error) {
		console.error('Failed to fetch article data:', error);
		return { article: null, error: 'Failed to fetch article data' };
	}
};


export const actions: Actions = {
	edit: async ({ request, cookies, fetch }) => {
		const rawFormData = await request.formData();
	
		const id = rawFormData.get("id")?.toString();
		if (!id) {
		  return fail(400, { success: false, errors: { root: "Missing article ID" } });
		}
	
		const title = rawFormData.get("title")?.toString() || "";
		const excerpt = rawFormData.get("excerpt")?.toString() || "";
		const content = rawFormData.get("content")?.toString() || "";
		const status = rawFormData.get("status")?.toString() || "Draft";
		const seoTitle = rawFormData.get("seoTitle")?.toString() || "";
		const seoDescription = rawFormData.get("seoDescription")?.toString() || "";
		const featuredImage = rawFormData.get("featuredImage") as File | null;
	
		const tags = rawFormData.getAll("tags").map((t) => t.toString());
		const categories = rawFormData.getAll("categories").map((c) => c.toString());
	
		const formData = { title, excerpt, status, seoTitle, seoDescription, tags, categories, content };
	
		// ✅ Validate normal fields
		const parsed = articleSchema.safeParse(formData);
		if (!parsed.success) {
		  const errors: Record<string, string> = {};
		  parsed.error.errors.forEach((err) => {
			errors[err.path.join(".")] = err.message;
		  });
		  return fail(400, { success: false, errors, values: formData });
		}
	
		// ✅ Validate image only if provided
		if (featuredImage && featuredImage.size > 0) {
		  if (!ACCEPTED_IMAGE_TYPES.includes(featuredImage.type)) {
			return fail(400, {
			  success: false,
			  errors: {
				featuredImage: `Unsupported image type. Accepted formats: ${ACCEPTED_IMAGE_TYPES.join(", ")}.`
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
		} else {
		  rawFormData.delete("featuredImage");
		}
	
		try {
			
		const api = new ApiService(fetch, cookies, "/api");
		const res: any = await api.put(`/articles/${id}`, { body: rawFormData, auth: true });
		console.log(res);


		if (!res?.id) {
			return fail(400, {
				success: false,
				errors: { root: res?.message || "Failed to update article" },
				values: formData
			});
		}
	
		  return { success: true, url: "/bits/admin/dashboard/articles" };
		} catch (err: any) {
		console.log(err);

		  return fail(500, {
			success: false,
			errors: { root: err.message || "Server error. Please try again." },
			values: formData
		  });
		}
	}
}