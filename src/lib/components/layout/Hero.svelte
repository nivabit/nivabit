<script lang="ts">
	import { ArrowRight, ArrowDown, Check, Clock, TrendingUp } from 'lucide-svelte';

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
		{ name: 'Facity', src: '/images/clients/7.png' },
		{ name: 'Tichly', src: '/images/clients/8.png' },
		{ name: 'EDGD Media', src: '/images/clients/1.png' },
		{ name: 'Project Enable Africa', src: '/images/clients/2.png' },
		{ name: 'Stanforte Edge', src: '/images/clients/4.png' },
		{ name: 'Lofiqmi', src: '/images/clients/5.png' },
		{ name: 'The ImisiOluwa', src: '/images/clients/6.png' }
	];
</script>

<section
	id="home"
	class="relative overflow-hidden bg-slate-50 px-4 pt-12 pb-16 md:px-8 md:pt-20 md:pb-24"
>
	<!-- Accent Place 1: Hero ambient anchor light (subtle top-center beacon) -->
	<div
		class="pointer-events-none absolute -top-28 left-1/2 h-64 w-[480px] -translate-x-1/2 rounded-full bg-[#0284c7]/12 blur-3xl"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-5xl">
		<!-- Main Hero Headline Block -->
		<div class="mx-auto max-w-3xl text-center">
			<!-- Accent Place 2: One headline word in accent color -->
			<h1
				class="text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-5xl md:text-[56px]"
			>
				We test your software concept with paying customers before you write <span
					class="text-[#0284c7]">code</span
				>.
			</h1>

			<p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
				Most software ideas burn capital building features nobody uses. Nivabit runs 14-day market
				validation sprints, then engineers production systems once demand is verified.
			</p>

			<!-- Primary & Secondary Actions (Hit target minimum 44x44px, real hover) -->
			<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
				<!-- Accent Place 3: Primary CTA button -->
				<a
					href="/#contact"
					class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl bg-[#0284c7] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0369a1] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.99]"
				>
					Book a Validation Sprint
					<ArrowRight size={16} strokeWidth={2.2} />
				</a>
				<a
					href="#system"
					class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:bg-slate-200"
				>
					Review Client Deliverables
				</a>
			</div>

			<!-- Hero Metric Row: Big numbers, small labels -->
			<div class="mt-10 grid grid-cols-2 gap-4 border-y border-slate-200/80 py-4 sm:grid-cols-4">
				<div class="text-center">
					<p class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">14 Days</p>
					<p class="mt-0.5 text-xs font-medium text-slate-500 uppercase">Sprint Turnaround</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">20+</p>
					<p class="mt-0.5 text-xs font-medium text-slate-500 uppercase">Buyer Interviews</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">84%</p>
					<p class="mt-0.5 text-xs font-medium text-slate-500 uppercase">Filtered Assumptions</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">$0</p>
					<p class="mt-0.5 text-xs font-medium text-slate-500 uppercase">Wasted Code Spend</p>
				</div>
			</div>
		</div>

		<!-- Asymmetric Modular Overview: Raw Hypothesis vs. Validated Demand -->
		<div class="mt-12 md:mt-16">
			<div class="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-5">
				<!-- Left Block: Raw Hypothesis (Before) -->
				<div
					class="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center"
				>
					<div class="space-y-3">
						<span
							class="inline-block rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 uppercase"
						>
							Before Sprint
						</span>
						<h3 class="text-lg font-bold text-slate-900">Unverified Hypothesis</h3>
						<ul class="space-y-2 text-xs text-slate-600">
							<li class="flex items-center gap-2">
								<span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
								Untested pricing and user willingness-to-pay
							</li>
							<li class="flex items-center gap-2">
								<span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
								Polite feedback from friends instead of buyers
							</li>
							<li class="flex items-center gap-2">
								<span class="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
								4 to 6 months of engineering runway at risk
							</li>
						</ul>
					</div>

					<!-- Wireframe SVG -->
					<div class="hidden shrink-0 sm:block" aria-hidden="true">
						<svg width="104" height="80" viewBox="0 0 104 80" fill="none">
							<rect
								x="4"
								y="8"
								width="36"
								height="20"
								rx="4"
								stroke="#CBD5E1"
								stroke-width="1.2"
								stroke-dasharray="3 3"
							/>
							<rect
								x="60"
								y="8"
								width="38"
								height="20"
								rx="4"
								stroke="#CBD5E1"
								stroke-width="1.2"
								stroke-dasharray="3 3"
							/>
							<rect
								x="28"
								y="48"
								width="46"
								height="22"
								rx="4"
								stroke="#CBD5E1"
								stroke-width="1.2"
								stroke-dasharray="3 3"
							/>
							<path
								d="M40 18H60M51 18V48"
								stroke="#CBD5E1"
								stroke-width="1.2"
								stroke-dasharray="3 3"
							/>
							<circle cx="51" cy="33" r="2.5" fill="#94A3B8" />
						</svg>
					</div>
				</div>

				<!-- Center Indicator -->
				<div class="flex items-center justify-center py-1 md:py-0">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs"
					>
						<ArrowRight size={15} class="hidden md:block" />
						<ArrowDown size={15} class="md:hidden" />
					</div>
				</div>

				<!-- Right Block: Validated Demand (After) - Clean Dark Card, No Nested Cards -->
				<div
					class="flex flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-[#090D14] p-6 text-white shadow-xs sm:flex-row sm:items-center"
				>
					<div class="space-y-3">
						<span
							class="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 uppercase"
						>
							<span class="h-1.5 w-1.5 rounded-[1px] bg-emerald-400"></span>
							Nivabit Output
						</span>
						<h3 class="text-lg font-bold text-white">Validated Demand Engine</h3>
						<ul class="space-y-2 text-xs font-medium text-slate-300">
							<li class="flex items-center gap-2">
								<Check size={14} strokeWidth={2.5} class="shrink-0 text-emerald-400" />
								20+ recorded buyer discovery interviews
							</li>
							<li class="flex items-center gap-2">
								<Check size={14} strokeWidth={2.5} class="shrink-0 text-emerald-400" />
								Live smoke-test click and waitlist intent
							</li>
							<li class="flex items-center gap-2">
								<Check size={14} strokeWidth={2.5} class="shrink-0 text-emerald-400" />
								Executive Go / No-Go verdict and roadmap
							</li>
						</ul>
					</div>

					<div class="hidden shrink-0 sm:block" aria-hidden="true">
						<svg width="104" height="80" viewBox="0 0 104 80" fill="none">
							<rect
								x="4"
								y="8"
								width="36"
								height="20"
								rx="4"
								fill="#1E293B"
								stroke="#334155"
								stroke-width="1.2"
							/>
							<rect
								x="60"
								y="8"
								width="38"
								height="20"
								rx="4"
								fill="#1E293B"
								stroke="#334155"
								stroke-width="1.2"
							/>
							<rect
								x="24"
								y="48"
								width="54"
								height="22"
								rx="4"
								fill="#0F172A"
								stroke="#16A34A"
								stroke-width="1.2"
							/>
							<path d="M22 28V38H78V28M50 38V48" stroke="#64748B" stroke-width="1.2" />
							<circle cx="50" cy="38" r="2.5" fill="#16A34A" />
							<rect x="36" y="56" width="30" height="5" rx="2.5" fill="#16A34A" />
						</svg>
					</div>
				</div>
			</div>

			<!-- Modular 4-Step Pipeline (Flat row without card-in-card nesting) -->
			<div class="mt-8">
				<div class="mb-4 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
					<h3 class="text-sm font-bold tracking-tight text-slate-900 uppercase">
						14-Day Validation Workflow
					</h3>
					<span class="text-xs font-medium text-slate-500"> 40+ market teardowns completed </span>
				</div>

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{#each pipelineSteps as step}
						<div
							class="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
						>
							<div class="mb-3 flex items-center justify-between">
								<span
									class="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white"
								>
									{step.num}
								</span>
								<span
									class="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
								>
									{step.tag}
								</span>
							</div>

							<div class="relative mb-3 h-28 overflow-hidden rounded-lg bg-slate-100">
								<img
									src={step.image}
									alt={step.title}
									class="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>

							<p class="text-sm font-semibold text-slate-900">{step.title}</p>
							<p class="mt-1 text-xs text-slate-500">{step.meta}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Client & Partner Logos Strip -->
		<div class="mt-14 border-t border-slate-200 pt-8 text-center">
			<p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">
				Trusted by founders, venture studios, and engineering leads
			</p>
			<div class="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-12">
				{#each clientLogos as client}
					<img
						src={client.src}
						alt={`${client.name} logo`}
						class="h-6 w-auto max-w-[130px] object-contain opacity-55 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
						loading="lazy"
					/>
				{/each}
			</div>
		</div>
	</div>
</section>
