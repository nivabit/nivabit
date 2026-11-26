<script lang="ts">
	import { ArrowRight, ArrowDown, Check, Sparkles } from 'lucide-svelte';

	const pipelineSteps = [
		{
			num: '01',
			title: 'Whitespace Audit',
			meta: 'Days 1–3 • 15+ Competitors',
			image: '/images/project/Project-7.png',
			tag: 'Market Map'
		},
		{
			num: '02',
			title: 'Pain-Point Mining',
			meta: 'Days 4–6 • 1,000+ Signals',
			image: '/images/project/Project-6.png',
			tag: 'ICP Intel'
		},
		{
			num: '03',
			title: 'Live Smoke Tests',
			meta: 'Days 7–10 • Real Intent',
			image: '/images/project/Project-8.png',
			tag: 'Demand Data'
		},
		{
			num: '04',
			title: 'Go / No-Go Dossier',
			meta: 'Days 11–14 • 20+ Interviews',
			image: '/images/project/Project-2.png',
			tag: 'Final Verdict'
		}
	];

	const clientLogos = [
		'/images/clients/1.png',
		'/images/clients/2.png',
		'/images/clients/3.png',
		'/images/clients/4.png',
		'/images/clients/5.png',
		'/images/clients/6.png'
	];
</script>

<section id="home" class="relative overflow-hidden bg-surface-light px-4 pt-10 pb-14 md:px-8 md:pt-16 md:pb-20">
	<div class="mx-auto max-w-5xl">
		<!-- Centered Headline Block -->
		<div class="mx-auto max-w-3xl text-center">
			<h1
				class="font-cabinet text-4xl leading-[1.03] font-extrabold tracking-[-0.03em] text-ink-primary sm:text-5xl md:text-6xl lg:text-[68px]"
			>
				We install your Validation Operating System.
			</h1>

			<p
				class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-secondary md:text-lg"
			>
				Data-driven customer discovery, competitor whitespace teardowns, and live demand smoke tests
				in 14 days — so you prove willingness-to-pay before writing a single line of code.
			</p>

			<div class="mt-7 flex flex-wrap items-center justify-center gap-3">
				<a
					href="/#contact"
					class="inline-flex items-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-accent-hover hover:shadow-md"
				>
					Validate Your Idea
					<ArrowRight size={15} strokeWidth={2.5} />
				</a>
				<a
					href="https://calendly.com/groupnivabit/30min"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-5 py-3 text-sm font-semibold text-ink-primary transition-colors hover:border-black/25 hover:bg-black/[0.02]"
				>
					Book a Discovery Call
				</a>
			</div>
		</div>

		<!-- Visual Architecture Diagram (Reference Top 2 Cards + Bottom Lime Pipeline Box) -->
		<div class="mt-12 md:mt-16">
			<!-- Row 1: Input -> Output Cards -->
			<div class="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-5">
				<!-- Left Card: White (Before / Raw Hypothesis) -->
				<div
					class="flex flex-col justify-between gap-5 rounded-2xl border border-black/8 bg-white p-6 shadow-xs sm:flex-row sm:items-center"
				>
					<div class="space-y-3">
						<span
							class="inline-block rounded-full bg-surface-light px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink-secondary uppercase"
						>
							Before Nivabit
						</span>
						<h3 class="font-cabinet text-lg font-bold text-ink-primary">Raw Hypothesis</h3>
						<ul class="space-y-1.5 text-xs text-ink-secondary">
							<li class="flex items-center gap-2">
								<span class="h-1.5 w-1.5 rounded-full bg-black/25"></span>
								Unproven market assumptions
							</li>
							<li class="flex items-center gap-2">
								<span class="h-1.5 w-1.5 rounded-full bg-black/25"></span>
								Polite praise instead of buying intent
							</li>
							<li class="flex items-center gap-2">
								<span class="h-1.5 w-1.5 rounded-full bg-black/25"></span>
								6+ months of engineering runway at risk
							</li>
						</ul>
					</div>

					<!-- Subtle Wireframe Node SVG -->
					<div class="hidden shrink-0 sm:block" aria-hidden="true">
						<svg width="110" height="84" viewBox="0 0 110 84" fill="none">
							<rect x="6" y="10" width="38" height="22" rx="6" stroke="#D4D4CE" stroke-width="1.2" stroke-dasharray="3 3" />
							<rect x="64" y="6" width="40" height="22" rx="6" stroke="#D4D4CE" stroke-width="1.2" stroke-dasharray="3 3" />
							<rect x="30" y="52" width="48" height="24" rx="6" stroke="#D4D4CE" stroke-width="1.2" stroke-dasharray="3 3" />
							<path d="M44 21H64M54 21V52" stroke="#D4D4CE" stroke-width="1.2" stroke-dasharray="3 3" />
							<circle cx="54" cy="36" r="3" fill="#D4D4CE" />
						</svg>
					</div>
				</div>

				<!-- Center Arrow -->
				<div class="flex items-center justify-center py-1 md:py-0">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-ink-primary shadow-xs"
					>
						<ArrowRight size={14} class="hidden md:block" />
						<ArrowDown size={14} class="md:hidden" />
					</div>
				</div>

				<!-- Right Card: Brand Blue (With Nivabit Validation OS) -->
				<div
					class="flex flex-col justify-between gap-5 rounded-2xl border border-brand-accent bg-brand-accent p-6 text-white shadow-sm sm:flex-row sm:items-center"
				>
					<div class="space-y-3">
						<span
							class="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase"
						>
							<Sparkles size={11} />
							Nivabit OS
						</span>
						<h3 class="font-cabinet text-lg font-extrabold text-white">
							Validated Demand Engine
						</h3>
						<ul class="space-y-1.5 text-xs font-medium text-white/90">
							<li class="flex items-center gap-2">
								<Check size={13} strokeWidth={3} class="shrink-0 text-white" />
								20+ verified ICP buyer interviews
							</li>
							<li class="flex items-center gap-2">
								<Check size={13} strokeWidth={3} class="shrink-0 text-white" />
								Live smoke-test conversion metrics
							</li>
							<li class="flex items-center gap-2">
								<Check size={13} strokeWidth={3} class="shrink-0 text-white" />
								Investor-grade Go / No-Go scorecard
							</li>
						</ul>
					</div>

					<!-- Structured System SVG -->
					<div class="hidden shrink-0 sm:block" aria-hidden="true">
						<svg width="110" height="84" viewBox="0 0 110 84" fill="none">
							<rect x="6" y="10" width="38" height="22" rx="6" fill="#FFFFFF" fill-opacity="0.14" stroke="#FFFFFF" stroke-width="1.3" />
							<rect x="64" y="10" width="40" height="22" rx="6" fill="#FFFFFF" fill-opacity="0.14" stroke="#FFFFFF" stroke-width="1.3" />
							<rect x="26" y="52" width="58" height="24" rx="6" fill="#0B0F1A" />
							<path d="M25 32V42H84V32M55 42V52" stroke="#FFFFFF" stroke-width="1.4" />
							<circle cx="55" cy="42" r="3" fill="#FFFFFF" />
							<rect x="38" y="61" width="34" height="5" rx="2.5" fill="#60A5FA" />
						</svg>
					</div>
				</div>
			</div>

			<!-- Connector Down -->
			<div class="my-3 flex justify-center">
				<div class="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white text-ink-primary">
					<ArrowDown size={13} />
				</div>
			</div>

			<!-- Row 2: Wide Brand Blue Pipeline Container with 4 Dark Cards -->
			<div class="rounded-3xl border border-brand-accent bg-brand-accent p-5 text-white shadow-lg shadow-brand-accent/20 md:p-7">
				<div class="mb-5 flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
					<p class="font-cabinet text-sm font-extrabold tracking-tight text-white md:text-base">
						Your 14-Day Validation Pipeline
					</p>
					<span class="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white">
						$500k+ Wasted Runway Saved • 40+ Market Teardowns
					</span>
				</div>

				<div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
					{#each pipelineSteps as step}
						<div
							class="group overflow-hidden rounded-2xl border border-white/10 bg-surface-dark p-3 text-white transition-transform duration-300 hover:-translate-y-1"
						>
							<div class="mb-2.5 flex items-center justify-between">
								<span
									class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-[10px] font-black text-white"
								>
									{step.num}
								</span>
								<span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80">
									{step.tag}
								</span>
							</div>

							<div class="relative mb-3 h-28 overflow-hidden rounded-xl bg-black/50">
								<img
									src={step.image}
									alt={step.title}
									class="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
								/>
							</div>

							<p class="font-cabinet text-sm font-bold text-white">{step.title}</p>
							<p class="mt-0.5 text-[11px] text-white/60">{step.meta}</p>
						</div>
					{/each}
				</div>

				<p class="mt-4 text-center text-xs font-semibold text-white/85">
					Delivered in 14 days with full interview transcripts, live demand metrics, and an
					investor-ready Go / No-Go dossier.
				</p>
			</div>
		</div>

		<!-- Trusted Logos Strip -->
		<div class="mt-12 border-t border-black/8 pt-8 text-center">
			<p class="text-xs font-semibold tracking-wider text-ink-muted uppercase">
				Trusted by founders, venture studios & innovation teams
			</p>
			<div class="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-12">
				{#each clientLogos as logo, i}
					<img
						src={logo}
						alt={`Partner ${i + 1}`}
						class="h-7 w-auto object-contain opacity-60 brightness-0 grayscale transition-opacity hover:opacity-100"
					/>
				{/each}
			</div>
		</div>
	</div>
</section>
