<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowUpRight } from 'lucide-svelte';
	import { getPublishedArticles } from '#lib/remote/articles.remote.ts';

	let { showHeader = false, limit = 10 } = $props();
	const articles = $derived(await getPublishedArticles());
</script>

<section id="articles" class="bg-surface-light px-4 py-16 md:px-8 md:py-24">
	<div class="mx-auto max-w-5xl">
		{#if showHeader}
			<div class="mb-12 text-center">
				<span
					class="inline-block rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-bold tracking-wide text-ink-primary uppercase"
				>
					More Research
				</span>
				<h2
					class="font-cabinet mt-3 text-3xl font-extrabold tracking-[-0.025em] text-ink-primary md:text-4xl"
				>
					Other Articles &amp; Teardowns
				</h2>
			</div>
		{/if}

		{#if !articles || articles.length <= 0}
			<div
				class="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-black/8 bg-white px-6 py-14 text-center shadow-xs"
			>
				<img
					src="/icons/EmptyState.svg"
					alt="No articles"
					class="mx-auto mb-5 h-32 w-32 opacity-75"
				/>
				<h3 class="font-cabinet mb-2 text-2xl font-extrabold text-ink-primary">
					No articles published yet
				</h3>
				<p class="mb-6 text-sm text-ink-secondary">
					Check back soon for new market teardowns, willingness-to-pay studies, and founder playbooks.
				</p>
				<a
					href="/"
					class="inline-flex items-center gap-2 rounded-full bg-lime-accent px-6 py-3 text-xs font-extrabold text-ink-primary transition-colors hover:bg-lime-accent-hover"
				>
					Back to Home
				</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				{#each articles.slice(0, limit) as article}
					<article
						class="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
					>
						<div class="relative h-48 w-full overflow-hidden bg-surface-dark">
							<img
								src={`${article.featuredImage}`}
								alt={article.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						<div class="flex flex-1 flex-col justify-between space-y-4 p-5">
							<div class="space-y-3">
								<div class="flex flex-wrap gap-1.5">
									{#each article.categories as category}
										<span
											class="rounded-full bg-lime-soft px-2.5 py-0.5 text-[10px] font-bold text-ink-primary"
										>
											{category}
										</span>
									{/each}
								</div>

								<h3 class="font-cabinet line-clamp-2 text-lg font-extrabold text-ink-primary">
									{article.title}
								</h3>

								<p class="line-clamp-2 text-xs leading-relaxed text-ink-secondary">
									{article.excerpt}
								</p>
							</div>

							<button
								type="button"
								onclick={() => goto(`/articles/${article.id}`)}
								class="inline-flex w-fit cursor-pointer items-center gap-1 text-xs font-bold text-ink-primary underline decoration-lime-accent decoration-2 underline-offset-4 transition-opacity hover:opacity-75"
							>
								Read Article
								<ArrowUpRight size={13} />
							</button>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
