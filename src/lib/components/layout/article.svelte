<script lang="ts">
	import { ArrowUpRight, Search } from 'lucide-svelte';
	import { getPublishedArticles } from '#lib/remote/articles.remote.ts';
	import { getArticleImage, onArticleImageError } from '#lib/constants/articleCategories.ts';

	let {
		showHeader = false,
		limit = undefined,
		showFilters = false
	}: {
		showHeader?: boolean;
		limit?: number;
		showFilters?: boolean;
	} = $props();

	const articles = $derived(await getPublishedArticles());

	let selectedCategory = $state<string>('All');
	let searchQuery = $state('');

	const allCategories = $derived.by(() => {
		const set = new Set<string>();
		for (const article of articles ?? []) {
			for (const cat of article.categories ?? []) {
				if (cat) set.add(cat);
			}
		}
		return ['All', ...Array.from(set)];
	});

	const visibleArticles = $derived.by(() => {
		const list = (articles ?? []).filter((article: any) => {
			if (selectedCategory !== 'All' && !(article.categories ?? []).includes(selectedCategory)) {
				return false;
			}
			if (searchQuery.trim()) {
				const q = searchQuery.trim().toLowerCase();
				const inTitle = article.title?.toLowerCase().includes(q);
				const inExcerpt = article.excerpt?.toLowerCase().includes(q);
				const inCat = (article.categories ?? []).some((c: string) => c.toLowerCase().includes(q));
				return inTitle || inExcerpt || inCat;
			}
			return true;
		});
		return typeof limit === 'number' ? list.slice(0, limit) : list;
	});
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

		{#if showFilters && articles?.length > 0}
			<div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex flex-wrap gap-2">
					{#each allCategories as category}
						<button
							type="button"
							onclick={() => (selectedCategory = category)}
							class={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
								selectedCategory === category
									? 'bg-brand-accent text-white shadow-xs'
									: 'border border-black/10 bg-white text-ink-secondary hover:border-black/20 hover:text-ink-primary'
							}`}
						>
							{category}
						</button>
					{/each}
				</div>

				<div class="relative w-full sm:w-64">
					<Search
						size={14}
						class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-secondary"
					/>
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search research..."
						class="w-full rounded-full border border-black/10 bg-white py-2 pr-4 pl-9 text-xs text-ink-primary placeholder:text-ink-secondary/60 focus:border-brand-accent focus:outline-none"
					/>
				</div>
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
					class="inline-flex items-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-xs font-extrabold text-white transition-colors hover:bg-brand-accent-hover"
				>
					Back to Home
				</a>
			</div>
		{:else if visibleArticles.length === 0}
			<div
				class="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-black/8 bg-white px-6 py-12 text-center shadow-xs"
			>
				<h3 class="font-cabinet mb-2 text-xl font-extrabold text-ink-primary">
					No matching research found
				</h3>
				<p class="mb-5 text-xs text-ink-secondary">
					Try clearing your search or selecting another category.
				</p>
				<button
					type="button"
					onclick={() => {
						selectedCategory = 'All';
						searchQuery = '';
					}}
					class="cursor-pointer rounded-full bg-brand-accent px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-accent-hover"
				>
					Reset filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				{#each visibleArticles as article}
					<article
						class="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
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

								<h3 class="font-cabinet line-clamp-2 text-lg font-extrabold text-ink-primary">
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
		{/if}
	</div>
</section>
