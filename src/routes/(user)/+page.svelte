<script lang="ts">
	import Hero from '#lib/components/layout/Hero.svelte';
	import Process from '#lib/components/layout/process.svelte';
	import Resources from '#lib/components/layout/resources.svelte';
	import Newsletter from '#lib/components/layout/newsletter.svelte';
	import ContactUs from '#lib/components/layout/contactUs.svelte';
	import { bookingModal } from '#lib/stores/bookingModal.svelte.ts';
	import {
		ArrowRight,
		ArrowUpRight,
		CheckCircle2,
		ShieldCheck,
		TrendingUp,
		Clock
	} from 'lucide-svelte';

	const systemNodesTop = [
		{
			title: 'Competitive Whitespace',
			desc: '15+ competitor teardowns exposing positioning gaps and feature fatigue.'
		},
		{
			title: 'Pain-Point Mining',
			desc: '1,000+ scraped reviews, forums & support complaints in your ICP’s exact words.'
		},
		{
			title: 'Zero-Code Smoke Tests',
			desc: 'Live landing experiments measuring real click-through and waitlist intent.'
		}
	];

	const systemNodesBottom = [
		{
			title: '20+ Buyer Interviews',
			desc: 'Unbiased discovery calls with verified decision-makers — never friends or family.'
		},
		{
			title: 'Pricing Elasticity',
			desc: 'Van Westendorp & willingness-to-pay modeling to lock optimal tiers before launch.'
		},
		{
			title: 'Go / No-Go Dossier',
			desc: '30+ page executive scorecard, unit economics & MVP feature priority matrix.'
		}
	];

	const bentoPrograms = [
		{
			title: 'Rapid Validation Sprint',
			duration: '10–14 Days',
			tags: ['Competitive Whitespace', 'Smoke Testing', 'Demand Scorecard'],
			desc: 'Before hiring engineers or writing code, we stress-test your core hypothesis in 14 days and deliver an unvarnished Go / No-Go verdict.',
			image: '/images/project/Project-7.png'
		},
		{
			title: 'Customer Discovery & WTP',
			duration: '2–3 Weeks',
			tags: ['20+ Target Interviews', 'Pricing Elasticity', 'MVP Priority Matrix'],
			desc: 'Direct discovery with your exact buyer persona. Separate polite compliments from genuine purchasing intent and rank must-have MVP features.',
			image: '/images/project/Project-6.png'
		},
		{
			title: 'Enterprise Opportunity Dossiers',
			duration: '3–4 Weeks',
			tags: ['Market Sizing', 'Moat Audits', 'Venture Feasibility'],
			desc: 'Deep-dive intelligence for venture studios and innovation teams evaluating new product verticals, acquisitions, or geographic expansion.',
			image: '/images/project/Project-2.png'
		},
		{
			title: 'Investor-Ready Evidence Room',
			duration: 'Included',
			tags: ['Verified Transcripts', 'Conversion Proof', 'Unit Economics'],
			desc: 'Walk into seed or board meetings with hard demand data, recorded buyer evidence, and validated CAC/LTV assumptions that close rounds.',
			image: '/images/project/Project-8.png'
		}
	];

	const caseStudyCharts = [
		{
			name: 'Allen Zito',
			role: 'Co-Founder, Tichly (EdTech)',
			badge: '4+ Months Runway Saved',
			metric: '3.8x Waitlist Conversion',
			avatar: '/images/profile3.jpg',
			summary:
				'Nivabit validated our student acquisition model and pricing elasticity before we built our platform. Their discovery findings eliminated 4 months of engineering false starts and tripled early signups.',
			calloutTitle: 'Nivabit Validation Sprint',
			calloutMetric: '+284% qualified demand',
			xLabels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 6', 'Wk 8'],
			pathD: 'M 24 142 C 95 140, 155 136, 220 128 C 285 120, 345 96, 415 62 C 475 34, 530 22, 576 14',
			areaD:
				'M 24 142 C 95 140, 155 136, 220 128 C 285 120, 345 96, 415 62 C 475 34, 530 22, 576 14 L 576 156 L 24 156 Z',
			markerX: 356,
			markerY: 91,
			endY: 14
		},
		{
			name: 'Stanley Onyebuchi',
			role: 'Director, Stanforte Edge',
			badge: '+62% Workflow Adoption',
			metric: 'Product Model Validated',
			avatar: '/images/profile2.jpg',
			summary:
				'The user discovery research Nivabit conducted completely reshaped our product strategy and accessibility workflows — validating critical user pathways before full rollout.',
			calloutTitle: 'Workflow Validated',
			calloutMetric: '+62% onboarding retention',
			xLabels: ['Pre-Sprint', 'Day 5', 'Day 10', 'Day 14', 'Month 2', 'Month 3'],
			pathD: 'M 24 144 C 100 142, 165 138, 240 130 C 310 122, 370 102, 435 72 C 490 46, 540 30, 576 18',
			areaD:
				'M 24 144 C 100 142, 165 138, 240 130 C 310 122, 370 102, 435 72 C 490 46, 540 30, 576 18 L 576 156 L 24 156 Z',
			markerX: 342,
			markerY: 112,
			endY: 18
		},
		{
			name: 'Grace Adebayo',
			role: 'Founder, Grace Inc. (Fintech)',
			badge: 'Seed Round Closed',
			metric: '24 Verified Buyer Calls',
			avatar: '/images/profile1.png',
			summary:
				'Their rapid validation sprint gave our angel investors the exact demand data and customer interview evidence needed to close our seed round. Fast, rigorous, and brutally honest.',
			calloutTitle: 'Dossier Delivered',
			calloutMetric: 'Seed round oversubscribed',
			xLabels: ['Hypothesis', 'Audit', 'Smoke Test', 'Interviews', 'Dossier', 'Seed Close'],
			pathD: 'M 24 146 C 110 145, 190 140, 260 128 C 325 116, 390 88, 455 56 C 505 32, 545 20, 576 12',
			areaD:
				'M 24 146 C 110 145, 190 140, 260 128 C 325 116, 390 88, 455 56 C 505 32, 545 20, 576 12 L 576 156 L 24 156 Z',
			markerX: 368,
			markerY: 96,
			endY: 12
		}
	];

	const realClientLogos = [
		{ name: 'EDGD Media', src: '/images/clients/1_dark.png' },
		{ name: 'Project Enable Africa', src: '/images/clients/2_dark.png' },
		{ name: 'Stanforte Edge', src: '/images/clients/4_dark.png' },
		{ name: 'Lofiqmi', src: '/images/clients/5_dark.png' },
		{ name: 'The ImisiOluwa', src: '/images/clients/6_dark.png' },
		{ name: 'Facity', src: '/images/clients/7_dark.png' },
		{ name: 'Tichly', src: '/images/clients/8_dark.png' },
		{ name: 'Broglux', src: '/images/clients/9_dark.png' }
	];

	const testimonialsGrid = [
		{
			quote:
				'Nivabit validated our target student acquisition model and pricing elasticity before we built our platform. Their discovery findings saved us over 4 months of engineering false starts.',
			name: 'Allen Zito',
			role: 'Co-Founder, Tichly',
			avatar: '/images/profile3.jpg'
		},
		{
			quote:
				'The user research Nivabit conducted completely clarified our product roadmap and accessibility workflows. An invaluable validation partner.',
			name: 'Stanley Onyebuchi',
			role: 'Director, Stanforte Edge',
			avatar: '/images/profile2.jpg'
		},
		{
			quote:
				'Their rapid validation sprint gave our angel investors the exact demand data and customer interview evidence needed to close our seed round. Fast, rigorous, and brutally honest.',
			name: 'Grace Adebayo',
			role: 'Founder, Grace Inc.',
			avatar: '/images/profile1.png'
		},
		{
			quote:
				'Instead of burning $80k building an unvalidated telehealth workflow, Nivabit showed us in 14 days which exact clinic segment would pay upfront — and which features to cut completely.',
			name: 'Dr. Tunde Balogun',
			role: 'Product Lead, HealthPulse',
			avatar: '/images/profile3.jpg'
		}
	];

	const projects = [
		{
			title: 'Facity',
			duration: '2 weeks',
			type: 'Demand Validation Sprint',
			category: 'Fintech',
			outcome: 'Validated $49/mo tier & 18% smoke-test signup rate',
			image: '/images/project/Project-7.png'
		},
		{
			title: 'Tichly',
			duration: '3 weeks',
			type: 'Audience Discovery Study',
			category: 'EdTech',
			outcome: '4+ months of engineering runway saved',
			image: '/images/project/Project-6.png'
		},
		{
			title: 'Stanforte Edge',
			duration: '2 weeks',
			type: 'Product Model Validation',
			category: 'Inclusion Tech',
			outcome: '+62% retention lift on validated onboarding workflow',
			image: '/images/project/Project-4.png'
		},
		{
			title: 'HealthPulse Platform',
			duration: '4 weeks',
			type: 'Enterprise Feasibility Dossier',
			category: 'Digital Health',
			outcome: 'Cleared enterprise compliance & buyer sign-off',
			image: '/images/project/Project-2.png'
		}
	];
</script>

<svelte:head>
	<title>Nivabit — We Install Your Validation Operating System</title>
	<meta
		name="description"
		content="Product idea validation and market research studio. Prove customer demand, pricing elasticity, and competitive whitespace in 14 days before writing code."
	/>
</svelte:head>

<div class="bg-surface-light text-ink-primary">
	<!-- 1. HERO + 2-CARD FLOW + 4-STAGE LIME PIPELINE + LOGOS -->
	<Hero />

	<!-- 2. DARK ARCHITECTURE BAND: "Inside the System" -->
	<section id="system" class="relative overflow-hidden bg-[#090D14] px-4 py-20 text-white md:px-8 md:py-28">
		<!-- Subtle grid texture -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.04]"
			style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;"
		></div>

		<div class="relative mx-auto max-w-5xl">
			<div class="mx-auto max-w-2xl text-center">
				<span
					class="inline-block rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold tracking-wider text-slate-300 uppercase"
				>
					System Architecture
				</span>
				<h2
					class="mt-4 text-3xl leading-[1.1] font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
				>
					Inside the Validation OS.
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">
					Six interconnected research modules feeding one decisive Go / No-Go engine. Built so you never gamble runway on guesswork.
				</p>
			</div>

			<!-- Modular Architecture Bento -->
			<div class="mt-14">
				<!-- Top 3 Satellites -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					{#each systemNodesTop as node, idx}
						<div
							class="neuron-card relative rounded-xl border border-slate-800 bg-[#111827] p-5 transition-colors hover:border-slate-700"
							style={`--pulse-delay: ${idx * 0.45}s;`}
						>
							<div class="mb-2.5 flex items-center justify-between gap-2">
								<div class="flex items-center gap-2.5">
									<span class="h-2 w-2 shrink-0 rounded-[1.5px] bg-[#60a5fa]"></span>
									<h3 class="text-sm font-bold text-white">{node.title}</h3>
								</div>
								<span class="font-mono text-[10px] font-semibold text-slate-400">
									0{idx + 1}
								</span>
							</div>
							<p class="text-xs leading-relaxed text-slate-400">{node.desc}</p>
						</div>
					{/each}
				</div>

				<!-- Top Traces -->
				<div class="relative hidden h-16 w-full md:block" aria-hidden="true">
					<svg
						viewBox="0 0 900 64"
						fill="none"
						preserveAspectRatio="none"
						class="h-full w-full overflow-visible"
					>
						<!-- Base neural pathways -->
						<path id="sys-top-0" d="M 450 64 C 450 28, 150 36, 150 0" stroke="#334155" stroke-opacity="0.4" stroke-width="1.5" />
						<path id="sys-top-1" d="M 450 64 L 450 0" stroke="#334155" stroke-opacity="0.4" stroke-width="1.5" />
						<path id="sys-top-2" d="M 450 64 C 450 28, 750 36, 750 0" stroke="#334155" stroke-opacity="0.4" stroke-width="1.5" />

						<!-- Synapse terminal square bits -->
						<rect x="147" y="0" width="6" height="6" rx="1" fill="#60a5fa" />
						<rect x="447" y="0" width="6" height="6" rx="1" fill="#60a5fa" />
						<rect x="747" y="0" width="6" height="6" rx="1" fill="#60a5fa" />
						<rect x="446.5" y="60" width="7" height="7" rx="1" fill="#2563eb" stroke="#60a5fa" stroke-width="1.5" />
					</svg>
				</div>

				<!-- Central Hub -->
				<div class="relative my-4 flex flex-col items-center md:my-0">
					<div
						class="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-lg"
					>
						<span
							class="inline-block rounded-md bg-slate-800 px-3 py-0.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase"
						>
							Core Engine
						</span>
						<h3 class="mt-3 text-xl font-bold text-white md:text-2xl">
							Nivabit Validation OS
						</h3>
						<p class="mt-1.5 text-xs leading-relaxed text-slate-300">
							Synthesizes competitor whitespace, live smoke-test intent, and 20+ buyer discovery calls into a clear Go / No-Go verdict in 14 days.
						</p>
					</div>
				</div>

				<!-- Bottom Traces -->
				<div class="relative hidden h-16 w-full md:block" aria-hidden="true">
					<svg
						viewBox="0 0 900 64"
						fill="none"
						preserveAspectRatio="none"
						class="h-full w-full overflow-visible"
					>
						<!-- Base pathways -->
						<path id="sys-bot-0" d="M 450 0 C 450 36, 150 28, 150 64" stroke="#334155" stroke-opacity="0.4" stroke-width="1.5" />
						<path id="sys-bot-1" d="M 450 0 L 450 64" stroke="#334155" stroke-opacity="0.4" stroke-width="1.5" />
						<path id="sys-bot-2" d="M 450 0 C 450 36, 750 28, 750 64" stroke="#334155" stroke-opacity="0.4" stroke-width="1.5" />

						<!-- Synapse terminal square bits -->
						<rect x="446.5" y="0" width="7" height="7" rx="1" fill="#2563eb" stroke="#60a5fa" stroke-width="1.5" />
						<rect x="147" y="60" width="6" height="6" rx="1" fill="#60a5fa" />
						<rect x="447" y="60" width="6" height="6" rx="1" fill="#60a5fa" />
						<rect x="747" y="60" width="6" height="6" rx="1" fill="#60a5fa" />
					</svg>
				</div>

				<!-- Bottom 3 Satellites -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					{#each systemNodesBottom as node, idx}
						<div
							class="neuron-card relative rounded-xl border border-slate-800 bg-[#111827] p-5 transition-colors hover:border-slate-700"
							style={`--pulse-delay: ${(idx + 1) * 0.45}s;`}
						>
							<div class="mb-2.5 flex items-center justify-between gap-2">
								<div class="flex items-center gap-2.5">
									<span class="h-2 w-2 shrink-0 rounded-[1.5px] bg-[#60a5fa]"></span>
									<h3 class="text-sm font-bold text-white">{node.title}</h3>
								</div>
								<span class="font-mono text-[10px] font-semibold text-slate-400">
									0{idx + 4}
								</span>
							</div>
							<p class="text-xs leading-relaxed text-slate-400">{node.desc}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- 3. LIGHT 2x2 BENTO FEATURE GRID: "You get a done-for-you validation team." -->
	<section id="services" class="bg-slate-50 px-4 py-20 md:px-8 md:py-28">
		<div class="mx-auto max-w-5xl">
			<div class="mx-auto max-w-2xl text-center">
				<span
					class="inline-block rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-wider text-slate-700 uppercase"
				>
					Validation Programs
				</span>
				<h2
					class="mt-4 text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
				>
					A dedicated validation team before you hire engineers.
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
					Productized research sprints built for founders, venture builders, and innovation leads.
				</p>
			</div>

			<!-- 2x2 Split Horizontal Cards -->
			<div class="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
				{#each bentoPrograms as program}
					<div
						class="group flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center"
					>
						<div class="flex-1 space-y-3">
							<div class="flex items-center gap-2">
								<span
									class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800"
								>
									<Clock size={12} />
									{program.duration}
								</span>
							</div>
							<h3 class="text-xl font-bold text-slate-900">
								{program.title}
							</h3>
							<p class="text-xs leading-relaxed text-slate-600">
								{program.desc}
							</p>
							<div class="flex flex-wrap gap-1.5 pt-1">
								{#each program.tags as tag}
									<span
										class="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
									>
										{tag}
									</span>
								{/each}
							</div>
						</div>

						<!-- Right Preview Thumbnail -->
						<div
							class="h-36 w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 sm:h-40 sm:w-36"
						>
							<img
								src={program.image}
								alt={program.title}
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 4. QUIET HIGH-CONTRAST CONVICTION STRIP -->
	<section class="border-y border-slate-800 bg-[#090D14] px-4 py-14 text-white md:px-8 md:py-16">
		<div class="mx-auto max-w-3xl text-center">
			<h2
				class="text-2xl leading-[1.1] font-bold tracking-tight text-white sm:text-3xl md:text-4xl"
			>
				You focus on building what wins. We prove customer demand first.
			</h2>
			<p class="mx-auto mt-3 max-w-xl text-sm font-medium text-slate-300">
				Stop guessing whether buyers will pay. Scope a 14-day sprint and get verifiable market proof before spending engineering capital.
			</p>
			<div class="mt-7">
				<a
					href="/#contact"
					class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:shadow hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#090D14]"
				>
					Request a Validation Audit
					<ArrowRight size={15} />
				</a>
			</div>
		</div>
	</section>

	<!-- 5. CUSTOM RESEARCH PROTOCOLS TREE DIAGRAM -->
	<Process />

	<!-- 6. CASE STUDIES WITH SVG AREA GROWTH CHARTS -->
	<section id="results" class="bg-slate-50 px-4 py-20 md:px-8 md:py-28">
		<div class="mx-auto max-w-4xl">
			<div class="mx-auto max-w-2xl text-center">
				<span
					class="inline-block rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-wider text-slate-700 uppercase"
				>
					Proven Outcomes
				</span>
				<h2
					class="mt-4 text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
				>
					Evidence that saved months of engineering runway.
				</h2>
			</div>

			<div class="mt-12 space-y-6">
				{#each caseStudyCharts as study, idx}
					<article
						class="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:p-8"
					>
						<!-- Top Founder & Metric Header -->
						<div class="flex flex-col gap-5 sm:flex-row sm:items-start">
							<img
								src={study.avatar}
								alt={study.name}
								class="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover sm:h-20 sm:w-20"
								loading="lazy"
							/>
							<div class="flex-1 space-y-2">
								<div class="flex flex-wrap items-center gap-2">
									<h3 class="text-lg font-bold text-slate-900">
										{study.name}
									</h3>
									<span
										class="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
									>
										{study.badge}
									</span>
									<span
										class="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
									>
										{study.role}
									</span>
								</div>
								<p class="text-sm leading-relaxed text-slate-600">
									“{study.summary}”
								</p>
							</div>
						</div>

						<!-- Area Growth Chart (UI UX Pro Max chart rules) -->
						<div class="relative mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4 pt-6">
							<!-- Dark Callout Pill -->
							<div
								class="mb-3 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-white shadow-sm sm:absolute sm:top-5 sm:left-[44%] sm:mb-0"
							>
								<TrendingUp size={13} class="text-emerald-400" />
								<div class="text-left leading-tight">
									<p class="text-[10px] font-semibold text-slate-400">{study.calloutTitle}</p>
									<p class="text-xs font-bold text-white">
										{study.calloutMetric}
									</p>
								</div>
							</div>

							<svg
								viewBox="0 0 600 175"
								class="h-40 w-full overflow-visible sm:h-48"
								role="img"
								aria-label={`${study.name} validation growth chart`}
							>
								<defs>
									<linearGradient id={`blueArea-${idx}`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stop-color="#2563eb" stop-opacity="0.25" />
										<stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
									</linearGradient>
								</defs>

								<!-- Horizontal guide lines -->
								<line x1="24" y1="36" x2="576" y2="36" stroke="#E2E8F0" stroke-dasharray="4 4" />
								<line x1="24" y1="96" x2="576" y2="96" stroke="#E2E8F0" stroke-dasharray="4 4" />
								<line x1="24" y1="156" x2="576" y2="156" stroke="#CBD5E1" />

								<!-- Area fill -->
								<path d={study.areaD} fill={`url(#blueArea-${idx})`} />

								<!-- Curve stroke -->
								<path
									d={study.pathD}
									fill="none"
									stroke="#2563eb"
									stroke-width="2.5"
									stroke-linecap="round"
								/>

								<!-- Sprint Inflection Marker -->
								<line
									x1={study.markerX}
									y1={study.markerY}
									x2={study.markerX}
									y2="156"
									stroke="#64748B"
									stroke-opacity="0.4"
									stroke-dasharray="3 3"
								/>
								<circle
									cx={study.markerX}
									cy={study.markerY}
									r="4.5"
									fill="#090D14"
									stroke="#60a5fa"
									stroke-width="2"
								/>

								<!-- End Peak Marker (Semantic Green: Validated outcome) -->
								<circle
									cx="576"
									cy={study.endY}
									r="5"
									fill="#16A34A"
									stroke="#FFFFFF"
									stroke-width="2"
								/>

								<!-- X-Axis Labels -->
								{#each study.xLabels as label, i}
									<text
										x={24 + i * 110.4}
										y="171"
										text-anchor="middle"
										class="fill-slate-500 text-[10px] font-medium"
									>
										{label}
									</text>
								{/each}
							</svg>
						</div>
					</article>
				{/each}
			</div>

			<!-- Centered Editorial Synthesis Block (matches reference paragraph below charts) -->
			<div class="mx-auto mt-12 max-w-2xl text-center">
				<p class="text-xs font-bold tracking-wider text-ink-muted uppercase">
					Why Evidence Beats Intuition
				</p>
				<p class="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
					Most startups don’t fail because of bad code — they fail because they spend six months
					shipping a product nobody will pay for. Nivabit compresses months of painful trial and
					error into a rigorous 14-day sprint backed by real buyer behavior.
				</p>
			</div>
		</div>
	</section>

	<!-- 7. EDITORIAL STUDIO STORY SPLIT -->
	<section id="story" class="bg-white px-4 py-20 md:px-8 md:py-28">
		<div class="mx-auto max-w-5xl">
			<div class="mx-auto mb-12 max-w-2xl text-center">
				<h2
					class="font-cabinet text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-ink-primary sm:text-4xl"
				>
					Built from 40+ real market teardowns.
				</h2>
			</div>

			<div class="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
				<!-- Left Rounded Visual -->
				<div class="md:col-span-6">
					<div class="overflow-hidden rounded-3xl border border-black/10 bg-surface-dark shadow-sm">
						<img
							src="/images/project/Project-1.png"
							alt="Nivabit Validation Studio"
							class="h-72 w-full object-cover md:h-96"
						/>
					</div>
				</div>

				<!-- Right Story Copy -->
				<div class="space-y-5 md:col-span-6">
					<p class="font-cabinet text-xl leading-snug font-bold text-ink-primary md:text-2xl">
						We started Nivabit after watching brilliant founders burn $100k+ building features
						customers politely praised — and never bought.
					</p>
					<p class="text-sm leading-relaxed text-ink-secondary md:text-base">
						Traditional agencies want to sell you a 6-month build. We do the opposite: we uncover
						the unvarnished truth about your market, competitive whitespace, and willingness-to-pay
						<em>before</em> you risk precious capital.
					</p>
					<p class="text-sm leading-relaxed text-ink-secondary">
						Whether the verdict is a resounding <strong class="text-ink-primary">Go</strong>, a
						sharper <strong class="text-ink-primary">Pivot</strong>, or a runway-saving
						<strong class="text-ink-primary">No-Go</strong>, you leave with clarity no pitch deck
						can fake.
					</p>
					<div class="pt-2">
						<a
							href="/#contact"
							class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-sm active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-slate-900"
						>
							Scope Your Sprint
							<ArrowRight size={15} strokeWidth={2.2} />
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 8. REAL CLIENT & PARTNER LOGOS -->
	<section class="border-y border-slate-200/80 bg-white px-4 py-16 md:px-8 md:py-20">
		<div class="mx-auto max-w-5xl">
			<div class="mb-10 text-center">
				<span
					class="inline-block rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold tracking-wider text-slate-600 uppercase"
				>
					Client Track Record
				</span>
				<h2
					class="font-cabinet mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl"
				>
					Trusted by Ambitious Founders &amp; Engineering Teams
				</h2>
				<p class="mx-auto mt-2 max-w-xl text-xs text-slate-500 sm:text-sm">
					From early-stage market validation sprints to full-scale digital product development.
				</p>
			</div>

			<div class="flex flex-wrap items-center justify-center gap-5 md:gap-8">
				{#each realClientLogos as client}
					<div
						class="flex h-16 w-36 items-center justify-center rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-all duration-300 hover:border-[#2563eb]/40 hover:shadow-md"
					>
						<img
							src={client.src}
							alt={`${client.name} logo`}
							class="max-h-7 max-w-[110px] object-contain opacity-85 transition-all duration-300 hover:opacity-100 hover:scale-105"
							loading="lazy"
						/>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 9. DARK OBSIDIAN SPOTLIGHT: THE VALIDATION MEMO (Working Newsletter Signup) -->
	<Newsletter />

	<!-- 10. TESTIMONIALS 2x2 + CASE STUDIES SHOWCASE -->
	<section id="portfolio" class="bg-surface-light px-4 py-20 md:px-8 md:py-28">
		<div class="mx-auto max-w-5xl">
			<div class="mx-auto max-w-2xl text-center">
				<span
					class="inline-block rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-bold tracking-wide text-ink-primary uppercase"
				>
					Founder Feedback
				</span>
				<h2
					class="font-cabinet mt-4 text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-ink-primary sm:text-4xl md:text-5xl"
				>
					What founders say about us.
				</h2>
			</div>

			<!-- 2x2 Quote Grid (Matches Reference) -->
			<div class="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
				{#each testimonialsGrid as item}
					<div
						class="flex flex-col justify-between rounded-2xl border border-black/8 bg-white p-6 shadow-xs"
					>
						<div class="mb-4 flex items-center gap-3">
							<img
								src={item.avatar}
								alt={item.name}
								class="h-10 w-10 rounded-full border border-black/10 object-cover"
							/>
							<div>
								<p class="font-cabinet text-sm font-bold text-ink-primary">{item.name}</p>
								<p class="text-xs text-ink-muted">{item.role}</p>
							</div>
						</div>
						<p class="text-sm leading-relaxed text-ink-secondary">“{item.quote}”</p>
					</div>
				{/each}
			</div>

			<!-- Case Study Cards Showcase -->
			<div class="mt-16">
				<div class="mb-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
					<h3 class="font-cabinet text-2xl font-extrabold text-ink-primary">
						Recent Validation Sprints
					</h3>
					<a
						href="/#contact"
						class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 underline decoration-slate-400 decoration-2 underline-offset-4 hover:opacity-75"
					>
						Request sample dossier
						<ArrowUpRight size={14} />
					</a>
				</div>

				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{#each projects as project}
						<div
							class="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
						>
							<div class="relative h-40 w-full overflow-hidden bg-slate-900">
								<img
									src={project.image}
									alt={project.title}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									loading="lazy"
								/>
								<span
									class="absolute top-3 left-3 rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs"
								>
									{project.category}
								</span>
							</div>
							<div class="space-y-2 p-4">
								<div class="flex items-center justify-between">
									<h4 class="text-base font-bold text-slate-900">
										{project.title}
									</h4>
									<span class="text-xs font-medium text-slate-500">{project.duration}</span>
								</div>
								<p class="text-xs font-medium text-slate-700">{project.type}</p>
								<p class="text-xs leading-snug text-slate-500">{project.outcome}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- LIVE RESEARCH ARTICLES (renders when database has articles) -->
	<Resources />

	<!-- 11. SPRINT SCOPER / CONTACT FORM -->
	<ContactUs />

	<!-- 12. FINAL OVERLAPPING-AVATAR CTA BAND -->
	<section class="bg-white px-4 py-20 text-center md:px-8 md:py-24">
		<div class="mx-auto max-w-2xl">
			<!-- Overlapping Founder Avatars -->
			<div class="mb-5 flex items-center justify-center -space-x-2.5">
				<img
					src="/images/profile1.png"
					alt="Founder"
					class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
					loading="lazy"
				/>
				<img
					src="/images/profile2.jpg"
					alt="Founder"
					class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
					loading="lazy"
				/>
				<img
					src="/images/profile3.jpg"
					alt="Founder"
					class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
					loading="lazy"
				/>
			</div>

			<h2
				class="text-3xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
			>
				Ready to validate before you build?
			</h2>
			<p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 md:text-base">
				Book a 30-minute scoping call. We will examine your riskiest assumptions and outline how to prove demand in 14 days.
			</p>

			<div class="mt-7 flex flex-wrap items-center justify-center gap-3">
				<button
					type="button"
					onclick={bookingModal.open}
					class="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
				>
					Book Your Discovery Call
					<ArrowUpRight size={16} strokeWidth={2.2} />
				</button>
			</div>

			<p class="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500">
				<ShieldCheck size={14} class="text-slate-700" />
				No obligation • Confidential NDA available on request
			</p>
		</div>
	</section>
</div>
