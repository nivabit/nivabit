<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import MainButton from '../customUI/button/MainButton.svelte';
	import Button from '../ui/button/button.svelte';

	let { showHeader = false, limit = 10 } = $props();
	let articles = $derived(page?.data?.articles || []);
</script>

<section id="articles" class="bg-bg-blue px-4 py-16 md:px-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		{#if showHeader}
			<div class="mb-16 text-center">
				<p use:reveal class="reveal font-synonym mb-1 text-lg text-brand-grey-500">Resources</p>
				<h2
					use:revealWords
					class="reveal-words font-cabinet text-3xl font-medium text-brand-grey-500 md:text-4xl lg:text-5xl"
				>
					Other Articles
				</h2>
			</div>
		{/if}

		{#if articles?.length <= 0}
			<div class="flex flex-col items-center py-10 text-center md:py-16">
				<img
					src="/icons/EmptyState.svg"
					alt="No articles"
					class="mx-auto h-36 w-36 opacity-70 sm:h-48 sm:w-48 md:h-72 md:w-72"
				/>
				<h3 class="mb-2 text-2xl font-medium text-brand-grey-500">No articles found</h3>
				<p class="mb-6 text-brand-grey-400">Check back later for more content and updates.</p>
				<MainButton
					href="/"
					class="flex shrink-0 items-center gap-2 rounded-full bg-brand-orange-500 text-center  text-sm text-white transition-colors hover:bg-brand-orange-500/90"
				>
					Go Home
				</MainButton>
			</div>
		{:else}
			<!-- Article Cards -->
			<div class="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
				{#each articles?.slice(0, limit) as article}
					<div
						use:reveal
						class="group reveal space-y-5 rounded-2xl border border-brand-blue-100 bg-brand-blue-50 p-4 md:p-5 transition-colors duration-300 ease-in-out hover:border-brand-blue-500"
					>
						<!-- Image with hover scale -->
						<div class="relative h-60 w-full overflow-hidden rounded-lg">
							<img
								src={`${article.featuredImage}`}
								alt="Blog Post"
								class="h-full w-full transform rounded-lg object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
							/>
						</div>

						<div class="space-y-5">
							<!-- Category Tags -->
							<div class="flex flex-wrap gap-3">
								{#each article.categories as category}
									<span
										class="rounded-full bg-bg-blue px-5 py-2 text-sm text-brand-grey-500 transition-colors duration-300 ease-in-out group-hover:bg-brand-blue-700 group-hover:text-white"
									>
										{category}
									</span>
								{/each}
							</div>

							<!-- Title -->
							<h3
								class="text-xl font-medium text-brand-grey-500 transition-colors duration-300 group-hover:text-brand-orange-500"
							>
								{article.title}
							</h3>

							<!-- Description -->
							<p
								class="line-clamp-2 text-sm leading-relaxed text-brand-grey-400 transition-colors duration-300 group-hover:text-brand-grey-500"
							>
								{article.excerpt}
							</p>

							<!-- Button -->
							<button
								type="button"
								class="flip-button text-sm text-brand-blue-500 transition-colors duration-300 hover:bg-transparent hover:text-brand-blue-700 hover:underline cursor-pointer"
								onclick={() => goto(`/articles/${article.id}`)}
							>
								<span class="slide-text">
									<span class="text-top">Read Blog</span>
									<span class="text-bottom">Read Blog</span>
								</span>
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
