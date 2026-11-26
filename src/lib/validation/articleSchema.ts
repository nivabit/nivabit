import * as v from 'valibot';

export const articleFormSchema = v.pipe(
	v.object({
		id: v.optional(v.string()),
		title: v.optional(v.string(), ''),
		excerpt: v.optional(v.string(), ''),
		content: v.optional(v.string(), ''),
		status: v.pipe(
			v.optional(v.string(), 'DRAFT'),
			v.transform((s) => s.toUpperCase()),
			v.picklist(['DRAFT', 'PUBLISHED'])
		),
		seoTitle: v.optional(v.string(), ''),
		seoDescription: v.optional(v.string(), ''),
		publishDate: v.optional(v.string(), ''),
		tags: v.optional(v.array(v.string()), []),
		categories: v.optional(v.array(v.string()), []),
		featuredImage: v.optional(v.instance(File))
	}),
	v.forward(
		v.check((d) => d.status === 'DRAFT' || Boolean(d.title.trim()), 'Title is required'),
		['title']
	),
	v.forward(
		v.check((d) => d.status === 'DRAFT' || Boolean(d.excerpt.trim()), 'Excerpt is required'),
		['excerpt']
	),
	v.forward(
		v.check((d) => d.status === 'DRAFT' || Boolean(d.content.trim()), 'Content is required'),
		['content']
	),
	v.forward(
		v.check(
			(d) => d.status === 'DRAFT' || d.categories.length > 0,
			'At least one category is required'
		),
		['categories']
	),
	v.forward(
		v.check((d) => d.status === 'DRAFT' || d.tags.length > 0, 'At least one tag is required'),
		['tags']
	),
	v.forward(
		v.check((d) => d.status === 'DRAFT' || Boolean(d.seoTitle.trim()), 'SEO title is required'),
		['seoTitle']
	),
	v.forward(
		v.check(
			(d) => d.status === 'DRAFT' || Boolean(d.seoDescription.trim()),
			'SEO description is required'
		),
		['seoDescription']
	)
);

export const articleSchema = articleFormSchema;
