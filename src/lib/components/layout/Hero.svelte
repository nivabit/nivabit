<script lang="ts">
	import CircularText from './circularText.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
</script>

<!-- {/* Hero Section */} -->
<section class="relative bg-brand-blue-900 px-4 pt-24 pb-12 md:px-16 md:pt-32 md:pb-16">
	<div class="mx-auto max-w-7xl">
		<div class="flex flex-col items-end justify-between gap-12 lg:flex-row lg:gap-24">
			<!-- {/* Hero Content */} -->
			<div class="max-w-4xl flex-1">
				<h1
					class="font-cabinet mb-5 text-4xl leading-[1.1] font-medium md:text-5xl lg:text-6xl xl:text-7xl"
				>
					<span use:revealWords class="reveal-words text-white"
						>We design and develop digital experiences that help
					</span>
					<span use:revealWords class="reveal-words text-brand-orange-500">businesses grow.</span>
				</h1>
				<p use:reveal class="reveal font-synonym mb-0 max-w-2xl text-lg leading-relaxed text-white">
					Transform your digital aspirations into reality with Nivabit. We specialize in crafting
					bespoke digital solutions that elevate your brand and drive success.
				</p>
			</div>

			<!-- {/* Circular Text Element */} -->
			<div use:reveal class="reveal hidden flex-shrink-0 lg:block">
				<CircularText />
			</div>
		</div>
	</div>
</section>
