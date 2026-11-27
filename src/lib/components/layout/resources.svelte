<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRight, ArrowUpRight } from 'lucide-svelte';
	import { getPublishedArticles } from '#lib/remote/articles.remote.ts';
	import { getArticleImage, onArticleImageError } from '#lib/constants/articleCategories.ts';

	const articles = $derived(await getPublishedArticles());
</script>

{#if articles?.length > 0}
	<section id="articles" class="bg-white px-4 py-20 md:px-8 md:py-24">
		<div class="mx-auto max-w-5xl">
			<div
				class="mb-12 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
			>
				<div>
					<span
						class="inline-block rounded-full border border-black/10 bg-surface-light px-3.5 py-1 text-[11px] font-bold tracking-wide text-ink-primary uppercase"
					>
						Research &amp; Insights
					</span>
					<h2
						class="mt-3 font-cabinet text-3xl font-extrabold tracking-[-0.025em] text-ink-primary sm:text-4xl"
					>
						Latest teardowns &amp; articles
					</h2>
				</div>

				<a
					href="/articles"
					class="inline-flex items-center gap-1.5 rounded-full border border-black/12 bg-surface-light px-5 py-2.5 text-xs font-bold text-ink-primary transition-colors hover:border-brand-accent hover:bg-brand-accent hover:text-white"
				>
					View all research
					<ArrowRight size={14} />
				</a>
			</div>

			<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				{#each articles.slice(0, 3) as article}
					<article
						class="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-surface-light transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:bg-white hover:shadow-md"
					>
						<div class="relative h-48 w-full overflow-hidden bg-surface-dark">
							<img
								src={getArticleImage(article.featuredImage)}
								alt={article.title}
								onerror={onArticleImageError}
								loading="lazy"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						<div class="flex flex-1 flex-col justify-between space-y-4 p-5">
							<div class="space-y-3">
								<div class="flex flex-wrap gap-1.5">
									{#each article.categories ?? [] as category}
										<span
											class="rounded-full bg-lime-soft px-2.5 py-0.5 text-[10px] font-bold text-ink-primary"
										>
											{category}
										</span>
									{/each}
								</div>

								<h3 class="line-clamp-2 font-cabinet text-lg font-extrabold text-ink-primary">
									{article.title}
								</h3>

								<p class="line-clamp-2 text-xs leading-relaxed text-ink-secondary">
									{article.excerpt}
								</p>
							</div>

							<a
								href={`/articles/${article.slug || article.id}`}
								class="inline-flex w-fit items-center gap-1 text-xs font-bold text-ink-primary underline decoration-lime-accent decoration-2 underline-offset-4 transition-opacity hover:opacity-75"
							>
								Read Article
								<ArrowUpRight size={13} />
							</a>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}
