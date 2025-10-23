<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import MainButton from '../customUI/button/MainButton.svelte';

	let articles = $derived(page?.data?.articles);
</script>

{#if articles?.length > 0}
<section id="articles" class="bg-bg-blue px-4 py-16 md:px-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p use:reveal class="reveal mb-1 text-lg text-brand-grey-500">Resources</p>
			<h2
				use:revealWords
				class="reveal-words text-3xl font-medium text-brand-grey-500 md:text-4xl lg:text-5xl"
			>
				Insights and Useful Articles
			</h2>
		</div>

		<!-- Article Cards -->
		<div class="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each articles as article}
				<div
					use:reveal
					class="group reveal space-y-5 rounded-2xl border border-brand-blue-100 bg-brand-blue-50 p-4 md:p-5 transition-colors duration-300 ease-in-out hover:border-brand-blue-500"
				>
					<!-- Image with hover scale -->
					<div class="relative h-60 w-full overflow-hidden rounded-lg">
						<img
							src={article.featuredImage}
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
							onclick={() => goto('/articles/' + article.id)}
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

		<!-- View All Button -->
		<div use:reveal class="reveal text-center">
			<MainButton
				href="/articles"
				class="mx-auto flex items-center gap-2 rounded-full bg-brand-orange-500 text-sm  text-white transition-colors hover:bg-brand-orange-500/90"
			>
				View all articles
				<svg width="16" height="16" viewBox="0 0 16 17" fill="none">
					<path
						d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z"
						fill="white"
					/>
				</svg>
			</MainButton>
		</div>
	</div>
</section>
{/if}


