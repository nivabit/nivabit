import { form, query, command, getRequestEvent } from '$app/server';
import { error, invalid } from '@sveltejs/kit';
import * as v from 'valibot';
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '#lib/server/prisma.ts';
import { requireUser } from '#lib/server/auth.ts';
import {
	ACCEPTED_IMAGE_TYPES,
	IMAGE_MAX_FILE_SIZE_BYTES,
	IMAGE_MAX_FILE_SIZE_MB
} from '#lib/constants/imageLimit.ts';
import { articleFormSchema } from '#lib/validation/articleSchema.ts';

const idSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty('Article ID is required'))
});

async function saveUploadedImage(file: File): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const sanitizedName = file.name.replace(/[^\w.-]/g, '');
	const fileName = `${Date.now()}-${sanitizedName}`;
	const uploadDir = path.join(process.cwd(), 'uploads');
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}
	fs.writeFileSync(path.join(uploadDir, fileName), buffer);
	return `/uploads/${fileName}`;
}

export const getPublishedArticles = query(async () => {
	return prisma.article.findMany({
		where: {
			NOT: { status: 'DRAFT' }
		},
		orderBy: { createdAt: 'desc' }
	});
});

export const getArticleById = query(idSchema, async ({ id }) => {
	const article = await prisma.article.findUnique({ where: { id } });
	if (!article) {
		throw error(404, 'Article not found');
	}
	return article;
});

export const incrementArticleViews = command(idSchema, async ({ id }) => {
	const existing = await prisma.article.findUnique({ where: { id } });
	if (!existing) return { views: 0 };

	const updated = await prisma.article.update({
		where: { id },
		data: { views: (existing.views ?? 0) + 1 }
	});

	return { views: updated.views };
});

export const getAdminArticles = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	return prisma.article.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: { id: true, name: true }
			}
		}
	});
});

export const createArticle = form(articleFormSchema, async (data, issue) => {
	const event = getRequestEvent();
	const admin = await requireUser(event);

	const file = data.featuredImage;
	if (data.status === 'PUBLISHED' && (!file || file.size === 0)) {
		return invalid(issue.featuredImage('Featured image is required for published articles.'));
	}

	let featuredImage: string | null = null;
	if (file && file.size > 0) {
		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			return invalid(
				issue.featuredImage(`Unsupported image type. Allowed: ${ACCEPTED_IMAGE_TYPES.join(', ')}`)
			);
		}
		if (file.size > IMAGE_MAX_FILE_SIZE_BYTES) {
			return invalid(issue.featuredImage(`Image too large. Max size is ${IMAGE_MAX_FILE_SIZE_MB}MB.`));
		}
		featuredImage = await saveUploadedImage(file);
	}

	const publishDate =
		data.status === 'PUBLISHED'
			? data.publishDate
				? new Date(data.publishDate)
				: new Date()
			: null;

	const article = await prisma.article.create({
		data: {
			title: data.title,
			excerpt: data.excerpt,
			content: data.content,
			categories: data.categories,
			status: data.status as any,
			publishDate,
			tags: data.tags,
			featuredImage,
			seoTitle: data.seoTitle,
			seoDescription: data.seoDescription,
			authorId: admin.id
		}
	});

	await getAdminArticles().refresh();
	return { success: true, id: article.id, url: '/bits/admin/dashboard/articles' };
});

export const updateArticle = form(articleFormSchema, async (data, issue) => {
	const event = getRequestEvent();
	await requireUser(event);

	if (!data.id) {
		return invalid('Missing article ID');
	}

	const existing = await prisma.article.findUnique({ where: { id: data.id } });
	if (!existing) {
		throw error(404, 'Article not found');
	}

	const file = data.featuredImage;
	if (data.status === 'PUBLISHED' && (!file || file.size === 0) && !existing.featuredImage) {
		return invalid(issue.featuredImage('Featured image is required for published articles.'));
	}

	let featuredImage = existing.featuredImage;
	if (file && file.size > 0) {
		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			return invalid(
				issue.featuredImage(`Unsupported image type. Allowed: ${ACCEPTED_IMAGE_TYPES.join(', ')}`)
			);
		}
		if (file.size > IMAGE_MAX_FILE_SIZE_BYTES) {
			return invalid(issue.featuredImage(`Image too large. Max size is ${IMAGE_MAX_FILE_SIZE_MB}MB.`));
		}

		if (existing.featuredImage) {
			const oldPath = path.join(process.cwd(), existing.featuredImage.replace(/^\//, ''));
			if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
		}

		featuredImage = await saveUploadedImage(file);
	}

	let publishDate = existing.publishDate;
	if (existing.status === 'DRAFT' && data.status === 'PUBLISHED') {
		publishDate = data.publishDate ? new Date(data.publishDate) : new Date();
	}

	await prisma.article.update({
		where: { id: data.id },
		data: {
			title: data.title,
			excerpt: data.excerpt,
			content: data.content,
			categories: data.categories,
			status: data.status as any,
			publishDate,
			tags: data.tags,
			featuredImage,
			seoTitle: data.seoTitle,
			seoDescription: data.seoDescription
		}
	});

	await getAdminArticles().refresh();
	return { success: true, url: '/bits/admin/dashboard/articles' };
});

export const deleteArticle = command(idSchema, async ({ id }) => {
	const event = getRequestEvent();
	await requireUser(event);

	const existing = await prisma.article.findUnique({ where: { id } });
	if (!existing) {
		throw error(404, 'Article not found');
	}

	await prisma.article.delete({ where: { id } });
	await getAdminArticles().refresh();
	return { success: true };
});
