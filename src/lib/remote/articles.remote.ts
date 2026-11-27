import { form, query, command, getRequestEvent } from '$app/server';
import { error, invalid } from '@sveltejs/kit';
import * as v from 'valibot';
import fs from 'node:fs';
import path from 'node:path';
import { desc, eq, ne, sql } from 'drizzle-orm';
import { db, articles } from '#lib/server/db/index.ts';
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
	try {
		return await db
			.select()
			.from(articles)
			.where(ne(articles.status, 'DRAFT'))
			.orderBy(desc(articles.createdAt));
	} catch (err) {
		console.error('[getPublishedArticles error]:', err);
		return [];
	}
});

export const getArticleById = query(idSchema, async ({ id }) => {
	const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
	if (!article) {
		throw error(404, 'Article not found');
	}
	return article;
});

export const incrementArticleViews = command(idSchema, async ({ id }) => {
	const [updated] = await db
		.update(articles)
		.set({ views: sql`${articles.views} + 1` })
		.where(eq(articles.id, id))
		.returning({ views: articles.views });

	return { views: updated?.views ?? 0 };
});

export const getAdminArticles = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	return db.query.articles.findMany({
		orderBy: [desc(articles.createdAt)],
		with: {
			author: {
				columns: { id: true, name: true }
			}
		}
	});
});

export const createArticle = form(articleFormSchema, async (data, issue) => {
	const event = getRequestEvent();
	const admin = await requireUser(event);

	const file = data.featuredImage;

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

	const [article] = await db
		.insert(articles)
		.values({
			title: data.title,
			excerpt: data.excerpt,
			content: data.content,
			categories: data.categories,
			status: data.status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
			publishDate,
			tags: data.tags,
			featuredImage,
			seoTitle: data.seoTitle,
			seoDescription: data.seoDescription,
			authorId: admin.id
		})
		.returning();

	await getAdminArticles().refresh();
	return { success: true, id: article.id, url: '/bits/admin/dashboard/articles' };
});

export const updateArticle = form(articleFormSchema, async (data, issue) => {
	const event = getRequestEvent();
	await requireUser(event);

	if (!data.id) {
		return invalid('Missing article ID');
	}

	const [existing] = await db.select().from(articles).where(eq(articles.id, data.id)).limit(1);
	if (!existing) {
		throw error(404, 'Article not found');
	}

	const file = data.featuredImage;

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

	await db
		.update(articles)
		.set({
			title: data.title,
			excerpt: data.excerpt,
			content: data.content,
			categories: data.categories,
			status: data.status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
			publishDate,
			tags: data.tags,
			featuredImage,
			seoTitle: data.seoTitle,
			seoDescription: data.seoDescription
		})
		.where(eq(articles.id, data.id));

	await getAdminArticles().refresh();
	return { success: true, url: '/bits/admin/dashboard/articles' };
});

export const deleteArticle = command(idSchema, async ({ id }) => {
	const event = getRequestEvent();
	await requireUser(event);

	const [existing] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
	if (!existing) {
		throw error(404, 'Article not found');
	}

	await db.delete(articles).where(eq(articles.id, id));
	await getAdminArticles().refresh();
	return { success: true };
});
