<script lang="ts">
	import Article from '#lib/components/layout/article.svelte';
	import ContactUs from '#lib/components/layout/contactUs.svelte';
	import Newsletter from '#lib/components/layout/newsletter.svelte';
</script>

<svelte:head>
	<title>Research &amp; Market Teardowns — Nivabit</title>
</svelte:head>

<div class="bg-surface-light text-ink-primary">
	<section class="bg-surface-light px-4 pt-12 pb-10 md:px-8 md:pt-20 md:pb-14">
		<div class="mx-auto max-w-3xl text-center">
			<span
				class="inline-block rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-bold tracking-wide text-ink-primary uppercase"
			>
				Research Library
			</span>
			<h1
				class="font-cabinet mt-4 text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-ink-primary sm:text-5xl md:text-6xl"
			>
				Market teardowns &amp; validation essays.
			</h1>
			<p class="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-secondary md:text-base">
				Deep dives into customer discovery, willingness-to-pay pricing experiments, and competitive
				whitespace before you commit engineering capital.
			</p>
		</div>
	</section>

	<Article />
	<Newsletter />
	<ContactUs />
</div>
