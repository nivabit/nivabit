<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import Article from '$lib/components/layout/article.svelte';
	import CircularText from '$lib/components/layout/circularText.svelte';
	import ContactUs from '$lib/components/layout/contactUs.svelte';
	import Hero from '$lib/components/layout/Hero.svelte';
	import Newsletter from '$lib/components/layout/newsletter.svelte';
	import RichTextEditor from '$lib/components/layout/RichTextEditor.svelte';

	const { data } = $props();

	let singleArticles: any = data?.singleArticles;
</script>

<main>
	<!-- {/* Hero Section */} -->
	<section class="bg-brand-blue-900 px-6 py-25 lg:px-15 lg:py-40">
		<div class="mx-auto max-w-4xl text-center">
			<div class="mb-10 flex items-center justify-center gap-3">
				{#each singleArticles?.categories as category}
					<span
						use:reveal
						class="reveal rounded-full bg-bg-blue px-5 py-2.5 text-sm text-brand-grey-500"
					>
						{category}
					</span>
				{/each}
			</div>
			<h1
				use:revealWords
				class="reveal-words mx-auto mb-6 max-w-[911px] text-4xl leading-[110%] font-medium text-white lg:text-7xl"
			>
				{singleArticles?.title}
			</h1>
			<p
				use:reveal
				class="reveal mx-auto max-w-[677px] text-base leading-[160%] text-white lg:text-lg"
			>
				{singleArticles?.excerpt}
			</p>
		</div>
	</section>

	<!-- {/* Main Content */} -->
	<section class="bg-bg-blue px-6 py-12 lg:px-[250px] lg:py-25">
		<div class="mx-auto max-w-none">
			<!-- {/* Hero Image */} -->
			<img
				use:reveal
				src={singleArticles?.featuredImage}
				alt="Hero"
				class="reveal mb-10 h-[475px] w-full rounded-[40px] object-cover"
			/>

			<!-- {/* Article Content */} -->
			<div use:reveal class="reveal space-y-12">
				<RichTextEditor bind:value={singleArticles.content} readOnly={true} />
			</div>
		</div>
	</section>

	<Article showHeader={true} limit={3} />
	<Newsletter class="bg-bg-orange" />
	<ContactUs />
</main>
