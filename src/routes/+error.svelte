<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import MainButton from '$lib/components/customUI/button/MainButton.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import { ArrowRight } from 'lucide-svelte';
</script>

<div class="h-full min-h-screen bg-bg-orange">
	<Header />
	<section
		class="flex h-full items-center bg-brand-blue-900 px-4 pt-24 pb-16 md:px-16 md:pt-32 md:pb-24"
	>
		<div class="mx-auto max-w-4xl text-center">
			<div use:reveal class="reveal">
				<h1
					use:revealWords
					class="reveal-words font-cabinet mb-8 text-6xl font-bold text-white md:text-8xl lg:text-9xl"
				>
					404
				</h1>
			</div>

			<h2 use:reveal class="reveal font-cabinet mb-6 text-2xl text-white md:text-3xl lg:text-4xl">
				Page Not Found
			</h2>

			<p
				use:reveal
				class="reveal font-synonym mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white"
			>
				The page you're looking for doesn't exist. It might have been moved, deleted, or you entered
				the wrong URL.
			</p>

			<div use:reveal class="reveal">
				<MainButton
					href="/"
					class="font-synonym inline-flex items-center gap-2 rounded-full bg-brand-orange-500 text-lg text-white transition-colors hover:bg-brand-orange-500/90"
				>
					Back to Home
					<ArrowRight />
				</MainButton>
			</div>
		</div>
	</section>
</div>
