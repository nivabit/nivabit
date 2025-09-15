import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { requireUser } from '$lib/server/auth';
import { articleSchema } from '$lib/validation/articleSchema';
import fs from 'fs';
import path from 'path';
import {
	ACCEPTED_IMAGE_TYPES,
	IMAGE_MAX_FILE_SIZE_BYTES,
	IMAGE_MAX_FILE_SIZE_MB
} from '$lib/constants/imageLimit';

export const GET: RequestHandler = async (event) => {
	const admin = await requireUser(event);
	if (!admin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const articles = await prisma.article.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: {
					id: true,
					name: true,
				}
			}
		}
	});

	return json(articles);
};

export const POST: RequestHandler = async (event) => {
	const admin = await requireUser(event);
	if (!admin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const form = await event.request.formData();

	// Extract form fields
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

	// Prepare data for validation
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

	// Validate using articleSchema
	const parsed = articleSchema.safeParse(formData);

	if (!parsed.success) {
		const errors = parsed.error.flatten().fieldErrors;
		return json({ success: false, errors }, { status: 400 });
	}

	// Validate image only if status is PUBLISHED
	let featuredImage: string | null = null;

	if (status === 'PUBLISHED') {
		if (!file || file.size === 0) {
			return json(
				{
					success: false,
					errors: { featuredImage: ['Featured image is required for published articles.'] }
				},
				{ status: 400 }
			);
		}
	}

	// If image is uploaded, validate type & size
	if (file && file.size > 0) {
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

		if (file.size > IMAGE_MAX_FILE_SIZE_BYTES) {
			return json(
				{
					success: false,
					errors: { featuredImage: [`File too large. Max size is ${IMAGE_MAX_FILE_SIZE_MB}MB.`] }
				},
				{ status: 400 }
			);
		}

		// Save file to /static/uploads
		const buffer = Buffer.from(await file.arrayBuffer());
		const fileName = `${Date.now()}-${file.name}`;
		const uploadDir = path.join('static', 'uploads');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = path.join(uploadDir, fileName);
		fs.writeFileSync(filePath, buffer);

		featuredImage = `/uploads/${fileName}`;
	}

	// Parse publishDate (fallback to now)
	// Determine publishDate
	const publishDate =
	status === 'PUBLISHED'
		? publishDateStr
			? new Date(publishDateStr)
			: new Date()
		: null;

	// Save to database
	const article = await prisma.article.create({
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
			seoDescription,
			authorId: admin.id
		}
	});

	return json(article, { status: 201 });
};
