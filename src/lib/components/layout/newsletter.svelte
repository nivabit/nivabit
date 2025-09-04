<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import { cn } from '$lib/utils';
	import MainButton from '../customUI/button/MainButton.svelte';
	import Input from '../ui/input/input.svelte';

	let { class: customClass = '' } = $props();
</script>

<!-- {/* Newsletter Section */} -->
<section class={cn(`bg-bg-blue px-4 py-16 md:px-16 md:py-24`, customClass)}>
	<div class="mx-auto max-w-7xl">
		<div class="flex flex-col items-start gap-12 lg:flex-row lg:gap-24">
			<div use:reveal class="reveal w-full flex-shrink-0 lg:w-96">
				<p class="text-lg text-brand-grey-500">Newsletter</p>
			</div>

			<div class="flex-1 space-y-10">
				<div>
					<h2
						use:revealWords
						class="reveal-words mb-3 text-2xl font-medium text-brand-grey-500 md:text-3xl"
					>
						Get Our Latest Insights on Topics
					</h2>
					<p use:reveal class="reveal text-lg leading-relaxed text-brand-grey-500">
						Our creative team transforms strategic insights into beautiful, functional designs
						through iterative prototyping, user testing, and refinement until every pixel aligns
						with your brand and business goals.
					</p>
				</div>

				<div use:reveal class="reveal flex max-w-lg items-center gap-3 rounded-full bg-white p-1">
					<Input
						type="email"
						placeholder="Your Email"
						class="placeholder:text-text-grey focus:ring-none flex-1 rounded-full border-none bg-white px-5  py-3 text-brand-grey-500 shadow-none focus:border-none focus:ring-brand-orange-500 focus:outline-none focus-visible:outline-none"
					/>
					<MainButton
						class="flex flex-shrink-0 items-center gap-2 rounded-full bg-brand-orange-500 px-5 py-3 text-sm  text-white transition-colors hover:bg-brand-orange-500/90"
					>
						Subscribe
						<svg width="16" height="16" viewBox="0 0 16 17" fill="none">
							<path
								d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z"
								fill="white"
							/>
						</svg>
					</MainButton>
				</div>
			</div>
		</div>
	</div>
</section>
