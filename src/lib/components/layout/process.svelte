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
					class="mx-auto max-w-[1000px] rounded-3xl bg-brand-blue-900 p-10"
					style="position: sticky;top: 80px;"
				>
					<div class="rounded-2xl border-2 border-dashed border-white p-8 md:p-16">
						<div class="flex flex-col items-start justify-between gap-8 md:flex-row lg:gap-16">
							<div class="w-full flex-shrink-0 lg:w-32">
								<p class="font-synonym text-lg text-white">{process.step}</p>
							</div>

							<div class="w-full flex-1 space-y-16 md:max-w-[400px]">
								<div class="">
									<svelte:component this={process.icon} />
								</div>

								<div class="space-y-5 text-center lg:text-left">
									<h3 class="font-cabinet text-2xl font-medium text-white md:text-3xl">
										{process.title}
									</h3>
									<p class="font-synonym text-lg leading-relaxed text-white">
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
