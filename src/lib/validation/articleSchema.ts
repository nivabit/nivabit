import { z } from 'zod';

export const articleSchema = z
	.object({
		title: z.string().optional(),
		excerpt: z.string().optional(),
		content: z.string().optional(),
		categories: z.array(z.string()).optional(),
		status: z.enum(['DRAFT', 'PUBLISHED']),
		tags: z.array(z.string()).optional(),
		seoTitle: z.string().optional(),
		seoDescription: z.string().optional()
	})
	.superRefine((data, ctx) => {
		if (data.status !== 'DRAFT') {
			if (!data.title?.trim()) {
				ctx.addIssue({
					path: ['title'],
					code: z.ZodIssueCode.custom,
					message: 'Title is required'
				});
			}
			if (!data.excerpt?.trim()) {
				ctx.addIssue({
					path: ['excerpt'],
					code: z.ZodIssueCode.custom,
					message: 'Excerpt is required'
				});
			}
			if (!data.content?.trim()) {
				ctx.addIssue({
					path: ['content'],
					code: z.ZodIssueCode.custom,
					message: 'Content is required'
				});
			}
			if (!data.categories || data.categories.length === 0) {
				ctx.addIssue({
					path: ['categories'],
					code: z.ZodIssueCode.custom,
					message: 'At least one category is required'
				});
			}
			if (!data.tags || data.tags.length === 0) {
				ctx.addIssue({
					path: ['tags'],
					code: z.ZodIssueCode.custom,
					message: 'At least one tag is required'
				});
			}
			if (!data.seoTitle?.trim()) {
				ctx.addIssue({
					path: ['seoTitle'],
					code: z.ZodIssueCode.custom,
					message: 'SEO title is required'
				});
			}
			if (!data.seoDescription?.trim()) {
				ctx.addIssue({
					path: ['seoDescription'],
					code: z.ZodIssueCode.custom,
					message: 'SEO description is required'
				});
			}
		}
	});
