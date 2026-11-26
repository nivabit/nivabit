<script lang="ts">
	import { page } from '$app/state';
	import Article from '#lib/components/layout/article.svelte';
	import ContactUs from '#lib/components/layout/contactUs.svelte';
	import Newsletter from '#lib/components/layout/newsletter.svelte';
	import RichTextEditor from '#lib/components/layout/RichTextEditor.svelte';
	import { getArticleById, incrementArticleViews } from '#lib/remote/articles.remote.ts';
	import { ArrowLeft } from 'lucide-svelte';

	let singleArticles: any = $derived(await getArticleById({ id: page.params.id! }));

	$effect(() => {
		const id = page.params.id;
		if (id) {
			incrementArticleViews({ id }).catch(() => {});
		}
	});
</script>

<svelte:head>
	<title>{singleArticles.seoTitle || singleArticles.title} — Nivabit</title>
	<meta name="description" content={singleArticles.seoDescription} />
	<meta name="author" content={singleArticles.authorId} />
	<meta property="og:title" content={singleArticles.seoTitle || singleArticles.title} />
	<meta
		property="og:description"
		content={singleArticles.seoDescription || singleArticles.excerpt}
	/>
	<meta property="og:image" content={singleArticles.featuredImage} />
	<meta property="og:type" content="article" />
	<meta name="keywords" content={singleArticles.tags?.join(', ')} />

	<script type="application/ld+json">
		{JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Article",
		"headline": singleArticles.title,
		"image": singleArticles.featuredImage,
		"author": { "@type": "Person", "name": singleArticles.authorId },
		"datePublished": singleArticles.publishDate,
		"dateModified": singleArticles.updatedAt,
		"description": singleArticles.seoDescription || singleArticles.excerpt
		})}
	</script>
</svelte:head>

{#key singleArticles?.id}
	<div class="bg-surface-light text-ink-primary">
		<section class="bg-surface-dark px-4 pt-14 pb-20 text-white md:px-8 md:pt-20 md:pb-24">
			<div class="mx-auto max-w-3xl text-center">
				<a
					href="/articles"
					class="mb-8 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-lime-accent hover:text-lime-accent"
				>
					<ArrowLeft size={13} />
					All Research
				</a>

				<div class="mb-5 flex flex-wrap items-center justify-center gap-2">
					{#each singleArticles?.categories || [] as category}
						<span
							class="rounded-full bg-lime-accent px-3 py-1 text-[11px] font-extrabold text-ink-primary"
						>
							{category}
						</span>
					{/each}
				</div>

				<h1
					class="font-cabinet mx-auto mb-5 text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl"
				>
					{singleArticles?.title}
				</h1>
				<p class="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
					{singleArticles?.excerpt}
				</p>
			</div>
		</section>

		<section class="bg-surface-light px-4 py-12 md:px-8 md:py-16">
			<div class="mx-auto max-w-3xl">
				{#if singleArticles?.featuredImage}
					<img
						src={singleArticles.featuredImage}
						alt={singleArticles.title}
						class="-mt-20 mb-10 h-64 w-full rounded-3xl border border-black/10 object-cover shadow-lg sm:h-96"
					/>
				{/if}

				<div class="rounded-3xl border border-black/8 bg-white p-6 shadow-xs md:p-10">
					<RichTextEditor bind:value={singleArticles.content} readOnly={true} />
				</div>
			</div>
		</section>

		<Article showHeader={true} limit={3} />
		<Newsletter />
		<ContactUs />
	</div>
{/key}
