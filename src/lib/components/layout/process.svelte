<script lang="ts">
	const protocols = [
		{
			code: '01',
			label: 'Whitespace',
			sub: '15+ competitor teardowns & positioning gaps'
		},
		{
			code: '02',
			label: 'Pain Mining',
			sub: '1,000+ real reviews & community complaints'
		},
		{
			code: '03',
			label: 'Smoke Tests',
			sub: 'Live zero-code conversion & intent tracking'
		},
		{
			code: '04',
			label: 'Interviews',
			sub: '20+ verified ICP decision-maker calls'
		},
		{
			code: '05',
			label: 'Pricing WTP',
			sub: 'Elasticity & willingness-to-pay modeling'
		},
		{
			code: '06',
			label: 'MVP Scope',
			sub: 'Must-have vs. bloat feature priority matrix'
		},
		{
			code: '07',
			label: 'Go / No-Go',
			sub: '30+ page investor-ready evidence dossier'
		}
	];

	// 7 evenly spaced target X positions across a 1050-wide SVG viewBox
	const branchXs = [75, 225, 375, 525, 675, 825, 975];
</script>

<section id="process" class="bg-white px-4 py-20 md:px-8 md:py-28">
	<div class="mx-auto max-w-5xl">
		<!-- Section Header -->
		<div class="mx-auto max-w-2xl text-center">
			<span
				class="inline-block rounded-full border border-black/10 bg-surface-light px-3.5 py-1 text-xs font-bold tracking-wide text-ink-primary uppercase"
			>
				14-Day Methodology
			</span>
			<h2
				class="font-cabinet mt-4 text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-ink-primary sm:text-4xl md:text-5xl"
			>
				Custom research protocols, built for your market.
			</h2>
			<p class="mt-4 text-sm leading-relaxed text-ink-secondary md:text-base">
				Every sprint follows a repeatable 7-stage evidence pipeline tailored to your vertical,
				ideal buyer persona, and pricing model.
			</p>
		</div>

		<!-- Root Node + Animated Neural Branch Tree -->
		<div class="mt-12 flex flex-col items-center">
			<!-- Top Dark Pill Hub -->
			<div
				class="relative z-10 inline-flex items-center gap-3 rounded-2xl border border-brand-accent/40 bg-surface-dark px-6 py-3.5 text-white shadow-md"
			>
				<span class="h-2.5 w-2.5 rounded-full bg-brand-accent-light shadow-[0_0_8px_#60A5FA]"></span>
				<span class="font-cabinet text-sm font-bold tracking-tight md:text-base">
					Your Product Hypothesis &amp; Target ICP
				</span>
				<span
					class="rounded-full bg-brand-accent px-2.5 py-0.5 text-[10px] font-black text-white uppercase"
				>
					Day 0
				</span>
			</div>

			<!-- Animated SVG Neural Branching Connectors (Desktop) -->
			<div class="relative hidden h-16 w-full lg:block" aria-hidden="true">
				<svg
					viewBox="0 0 1050 64"
					fill="none"
					preserveAspectRatio="none"
					class="h-full w-full overflow-visible"
				>
					<defs>
						<filter id="procNeuronGlow" x="-40%" y="-40%" width="180%" height="180%">
							<feGaussianBlur stdDeviation="2" result="blur" />
							<feMerge>
								<feMergeNode in="blur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>

					{#each branchXs as targetX, i}
						{@const pathId = `proc-branch-${i}`}
						{@const d =
							targetX === 525
								? 'M 525 0 L 525 64'
								: `M 525 0 C 525 32, ${targetX} 26, ${targetX} 64`}
						<!-- Base line -->
						<path id={pathId} {d} stroke="#2563EB" stroke-opacity="0.18" stroke-width="1.5" />
						<!-- Animated traveling pulse -->
						<path
							{d}
							stroke="#2563EB"
							stroke-width="2"
							stroke-linecap="round"
							class="neuron-trace"
							style={`animation-delay: ${i * 0.25}s;`}
						/>
						<!-- Signal orb firing down to card -->
						<circle r="3.5" fill="#2563EB" filter="url(#procNeuronGlow)">
							<animateMotion dur="2.1s" repeatCount="indefinite" begin={`${i * 0.25}s`}>
								<mpath href={`#${pathId}`} />
							</animateMotion>
						</circle>
						<!-- Terminal node -->
						<circle cx={targetX} cy="63" r="2.5" fill="#2563EB" />
					{/each}
					<circle cx="525" cy="1" r="3.5" fill="#2563EB" />
				</svg>
			</div>

			<!-- 7 Branch Nodes (Clean typographic numbers, no AI icons) -->
			<div class="mt-6 grid w-full grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:mt-0 lg:grid-cols-7 lg:gap-3">
				{#each protocols as step, i}
					<div class="flex flex-col items-center text-center">
						<div
							class="neuron-card-light group flex w-full flex-col items-center rounded-2xl border border-black/10 bg-surface-dark px-3 py-5 text-white shadow-xs transition-colors duration-200 hover:border-brand-accent"
							style={`--pulse-delay: ${i * 0.25}s;`}
						>
							<span
								class="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg border border-brand-accent/30 bg-brand-accent/15 font-mono text-xs font-bold text-brand-accent-light tabular-nums transition-colors group-hover:bg-brand-accent group-hover:text-white"
							>
								{step.code}
							</span>
							<span class="font-cabinet text-xs font-bold text-white">{step.label}</span>
							<span class="mt-1 font-mono text-[10px] font-semibold text-brand-accent-light/80 tabular-nums">
								Step {step.code}
							</span>
						</div>

						<p class="mt-2.5 px-1 text-[11px] leading-snug text-ink-secondary">
							{step.sub}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
