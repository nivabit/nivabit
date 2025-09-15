import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { requireUser } from '$lib/server/auth';
import fs from 'fs';
import path from 'path';
import {
	ACCEPTED_IMAGE_TYPES,
	IMAGE_MAX_FILE_SIZE_BYTES,
	IMAGE_MAX_FILE_SIZE_MB
} from '$lib/constants/imageLimit';
import { articleSchema } from '$lib/validation/articleSchema';

export const GET: RequestHandler = async ({ params }) => {
	const article = await prisma.article.findUnique({ where: { id: params.id } });
	if (!article) return json({ error: 'Not found' }, { status: 404 });
	return json(article);
};

export const PUT: RequestHandler = async (event) => {
	const admin = await requireUser(event);
	if (!admin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const articleId = event.params.id;

	// Check if article exists
	const existingArticle = await prisma.article.findUnique({ where: { id: articleId } });
	if (!existingArticle) {
		return json({ error: 'Article not found' }, { status: 404 });
	}

	// 2️⃣ Handle full update (formData with optional file)
	const form = await event.request.formData();

	// Extract fields safely (with fallback empty string or empty array)
	const title = form.get('title')?.toString() || '';
	const excerpt = form.get('excerpt')?.toString() || '';
	const content = form.get('content')?.toString() || '';
	const status = (form.get('status')?.toString() || 'DRAFT').toUpperCase();
	const seoTitle = form.get('seoTitle')?.toString() || '';
	const seoDescription = form.get('seoDescription')?.toString() || '';
	const publishDateStr = form.get('publishDate')?.toString();
	const tags = form.getAll('tags').map(String);
	const categories = form.getAll('categories').map(String);
	const file = form.get('featuredImage') as File | null;

	// Prepare data for Zod validation (exclude image)
	const formData = {
		title,
		excerpt,
		content,
		status,
		seoTitle,
		seoDescription,
		tags,
		categories
	};

	// Validate input with Zod schema
	const parsed = articleSchema.safeParse(formData);

	if (!parsed.success) {
		const errors = parsed.error.flatten().fieldErrors;
		return json({ success: false, errors }, { status: 400 });
	}

	// Validate featuredImage only if status is PUBLISHED
	if (status === 'PUBLISHED') {
		if ((!file || file.size === 0) && !existingArticle.featuredImage) {
			// If no new image uploaded and no existing image
			return json(
				{
					success: false,
					errors: { featuredImage: ['Featured image is required for published articles.'] }
				},
				{ status: 400 }
			);
		}
	}

	// Validate uploaded image file (if any)
	let featuredImage: string | null = existingArticle.featuredImage;


	if (file && file.size > 0) {
		// Validate type
		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			return json(
				{
					success: false,
					errors: {
						featuredImage: [`Invalid file type. Allowed: ${ACCEPTED_IMAGE_TYPES.join(', ')}`]
					}
				},
				{ status: 400 }
			);
		}

		// Validate size
		if (file.size > IMAGE_MAX_FILE_SIZE_BYTES) {
			return json(
				{
					success: false,
					errors: { featuredImage: [`File too large. Max size is ${IMAGE_MAX_FILE_SIZE_MB}MB.`] }
				},
				{ status: 400 }
			);
		}

		// Delete old image if exists
		if (existingArticle.featuredImage) {
			const oldPath = path.join('static', existingArticle.featuredImage);
			if (fs.existsSync(oldPath)) {
				fs.unlinkSync(oldPath);
			}
		}

		// Save new image
		const buffer = Buffer.from(await file.arrayBuffer());
		const sanitizedFileName = file.name.replace(/[^\w.-]/g, '');
		const fileName = `${Date.now()}-${sanitizedFileName}`;
		const uploadDir = path.join('static', 'uploads');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = path.join(uploadDir, fileName);
		fs.writeFileSync(filePath, buffer);

		featuredImage = `/uploads/${fileName}`;
	}

	// Determine publishDate to use:
	// Only update publishDate if status is changing from DRAFT to PUBLISHED
	let publishDate = existingArticle.publishDate; // default: keep old date

	if (existingArticle.status === 'DRAFT' && status === 'PUBLISHED') {
		// Use the new publishDate if provided, else now
		publishDate = publishDateStr ? new Date(publishDateStr) : new Date();
	}

	// Update article in database
	const updatedArticle = await prisma.article.update({
		where: { id: articleId },
		data: {
			title,
			excerpt,
			content,
			categories,
			status: status as any,
			publishDate,
			tags,
			featuredImage,
			seoTitle,
			seoDescription
		}
	});

	return json(updatedArticle);
};

export const DELETE: RequestHandler = async (event) => {
	const admin = await requireUser(event);
	if (!admin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Check if article exists
	const existingArticle = await prisma.article.findUnique({ where: { id: event.params.id } });
	if (!existingArticle) {
		return json({ error: 'Article not found' }, { status: 404 });
	}

	await prisma.article.delete({ where: { id: event.params.id } });
	return json({ success: true });
};

export const PATCH: RequestHandler = async ({ params }) => {
	try {
		// Find the existing article to get current views count
		const existingArticle = await prisma.article.findUnique({
			where: { id: params.id }
		});

		if (!existingArticle) {
			return json({ error: 'Article not found' }, { status: 404 });
		}

		const currentViews = existingArticle.views ?? 0;

		// Increment views by 1
		const updatedArticle = await prisma.article.update({
			where: { id: params.id },
			data: { views: currentViews + 1 }
		});

		return json(updatedArticle);
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to update views' }, { status: 500 });
	}
};

