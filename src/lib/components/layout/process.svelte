<script lang="ts">
	import {
		Radar,
		MessageSquareText,
		Flame,
		DollarSign,
		FileCheck2,
		Layers,
		Target
	} from 'lucide-svelte';

	const protocols = [
		{
			code: '01',
			label: 'Whitespace',
			sub: '15+ competitor teardowns & positioning gaps',
			icon: Radar
		},
		{
			code: '02',
			label: 'Pain Mining',
			sub: '1,000+ real reviews & community complaints',
			icon: MessageSquareText
		},
		{
			code: '03',
			label: 'Smoke Tests',
			sub: 'Live zero-code conversion & intent tracking',
			icon: Flame
		},
		{
			code: '04',
			label: 'Interviews',
			sub: '20+ verified ICP decision-maker calls',
			icon: Target
		},
		{
			code: '05',
			label: 'Pricing WTP',
			sub: 'Elasticity & willingness-to-pay modeling',
			icon: DollarSign
		},
		{
			code: '06',
			label: 'MVP Scope',
			sub: 'Must-have vs. bloat feature priority matrix',
			icon: Layers
		},
		{
			code: '07',
			label: 'Go / No-Go',
			sub: '30+ page investor-ready evidence dossier',
			icon: FileCheck2
		}
	];
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

		<!-- Root Node + Branching Connector Tree (Matches Reference Section) -->
		<div class="mt-12 flex flex-col items-center">
			<!-- Top Dark Pill Hub -->
			<div
				class="relative z-10 inline-flex items-center gap-3 rounded-2xl border border-black/15 bg-surface-dark px-6 py-3.5 text-white shadow-md"
			>
				<span class="h-2.5 w-2.5 rounded-full bg-brand-accent-light"></span>
				<span class="font-cabinet text-sm font-bold tracking-tight md:text-base">
					Your Product Hypothesis &amp; Target ICP
				</span>
				<span
					class="rounded-full bg-brand-accent px-2.5 py-0.5 text-[10px] font-black text-white uppercase"
				>
					Day 0
				</span>
			</div>

			<!-- Vertical Stem -->
			<div class="h-8 w-px bg-black/15"></div>

			<!-- Horizontal Branch Rail (desktop) -->
			<div class="hidden h-px w-[86%] bg-black/15 lg:block"></div>

			<!-- 7 Branch Nodes -->
			<div class="mt-4 grid w-full grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:mt-0 lg:grid-cols-7 lg:gap-3">
				{#each protocols as step}
					{@const Icon = step.icon}
					<div class="flex flex-col items-center text-center">
						<!-- Vertical tick down from rail on desktop -->
						<div class="hidden h-6 w-px bg-black/15 lg:block"></div>

						<!-- Dark Compact Module Card -->
						<div
							class="group flex w-full flex-col items-center rounded-2xl border border-black/10 bg-surface-dark px-3 py-4 text-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-brand-accent"
						>
							<div
								class="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-brand-accent-light transition-colors group-hover:bg-brand-accent group-hover:text-white"
							>
								<Icon size={16} strokeWidth={2.2} />
							</div>
							<span class="font-cabinet text-xs font-bold text-white">{step.label}</span>
							<span class="mt-0.5 text-[10px] font-semibold text-brand-accent-light">
								Step {step.code}
							</span>
						</div>

						<!-- Short Description Below -->
						<p class="mt-2.5 px-1 text-[11px] leading-snug text-ink-secondary">
							{step.sub}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
