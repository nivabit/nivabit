export const DEFAULT_ARTICLE_CATEGORIES = [
	'Market Validation',
	'Customer Discovery',
	'Pricing & WTP',
	'Teardowns',
	'Product Strategy',
	'Engineering',
	'Case Studies',
	'Research'
] as const;

export const DEFAULT_ARTICLE_IMAGE = '/images/default-article-cover.jpg';

export function getArticleImage(src?: string | null): string {
	return src && src.trim().length > 0 ? src : DEFAULT_ARTICLE_IMAGE;
}

export function onArticleImageError(e: Event) {
	const img = e.currentTarget as HTMLImageElement | null;
	if (!img || img.dataset.fallbackApplied) return;
	img.dataset.fallbackApplied = 'true';
	img.src = DEFAULT_ARTICLE_IMAGE;
}
