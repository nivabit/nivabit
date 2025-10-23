<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import Code from '../icon/code.svelte';
	import Design from '../icon/design.svelte';
	import Discovery from '../icon/discovery.svelte';
	import Kickoff from '../icon/kickoff.svelte';
	import Launch from '../icon/launch.svelte';

	const processes = [
		{
			step: 'Step 1',
			title: 'Kickoff Meeting',
			description:
				'We begin with an in-depth collaborative session where we immerse ourselves in your business objectives, challenges, and aspirations to establish the perfect foundation for our partnership.',
			icon: Kickoff
		},
		{
			step: 'Step 2',
			title: 'Discovery Phase',
			description:
				'Through comprehensive market analysis, user research, and technical audits, we uncover critical insights that shape every decision moving forward, ensuring your solution is built on data rather than assumptions.',
			icon: Discovery
		},
		{
			step: 'Step 3',
			title: 'Design',
			description:
				'Our creative team transforms strategic insights into beautiful, functional designs through iterative prototyping, user testing, and refinement until every pixel aligns with your brand and business goals.',
			icon: Design
		},
		{
			step: 'Step 4',
			title: 'Develop',
			description:
				'Using agile development methodologies, we build robust, scalable solutions with clean code architecture while maintaining transparent communication through every sprint and milestone.',
			icon: Code
		},
		{
			step: 'Step 5',
			title: 'Launch',
			description:
				"We don't just deploy your project - we implement thorough quality assurance, performance optimization, and knowledge transfer to ensure you're fully equipped for long-term success and growth.",
			icon: Launch
		}
	];
</script>

<section class="bg-bg-orange px-4 py-16 md:px-16 md:py-24">
	<div class="mx-auto max-w-6xl text-center">
		<div class="mb-10">
			<p use:reveal class="reveal font-synonym mb-1 text-lg text-brand-grey-500">
				The Nivabit Method
			</p>
			<h2
				use:revealWords
				class="reveal-words font-cabinet text-3xl font-medium text-brand-grey-500 md:text-4xl lg:text-5xl"
			>
				Where Ideas Take Shape
			</h2>
		</div>
		<!-- Process Steps -->
		<div  class=" space-y-5">
			{#each processes as process}
				<div
					class="mx-auto max-w-[1000px] rounded-3xl bg-brand-blue-900 md:p-10 p-4"
					style="position: sticky;top: 80px;"
				>
					<div class="box-border rounded-2xl border-white py-10 px-5 md:px-16 md:py-16">
						<div class="flex flex-col items-start justify-between gap-8 md:flex-row lg:gap-16">
							<div class="w-full shrink-0 lg:w-32">
								<p class="font-synonym text-lg text-white text-start">{process.step}</p>
							</div>

							<div class="w-full flex-1 md:space-y-16 space-y-10 md:max-w-[400px]">
								<div class="">
									<svelte:component this={process.icon} />
								</div>

								<div class="space-y-5 text-center lg:text-left">
									<h3 class="font-cabinet text-2xl font-medium text-white md:text-3xl text-start">
										{process.title}
									</h3>
									<p class="font-synonym text-start text-base md:text-lg leading-relaxed text-white">
										{process.description}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	/* .box-border {
  border: 4px solid transparent;
  border-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect x='1' y='1' width='18' height='18' fill='none'stroke='white' stroke-width='2'stroke-dasharray='3 6' stroke-linecap='round'/%3E%3C/svg%3E") 10 round;
} */

.box-border {
  position: relative;
  border: none;
  border-radius: 0.5rem; /* adjust for your design */
  overflow: hidden; /* important! clips child pseudo-element */
}

.box-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px; /* adjust for border thickness */
  background:
    repeating-linear-gradient(to right, white 0 10px, transparent 10px 20px) top / 100% 1px no-repeat,
    repeating-linear-gradient(to right, white 0 10px, transparent 10px 20px) bottom / 100% 1px no-repeat,
    repeating-linear-gradient(to bottom, white 0 10px, transparent 10px 20px) left / 1px 100% no-repeat,
    repeating-linear-gradient(to bottom, white 0 10px, transparent 10px 20px) right / 1px 100% no-repeat;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}


</style>