<script lang="ts">
	import Hero from '#lib/components/layout/Hero.svelte';
	import Process from '#lib/components/layout/process.svelte';
	import Resources from '#lib/components/layout/resources.svelte';
	import Newsletter from '#lib/components/layout/newsletter.svelte';
	import ContactUs from '#lib/components/layout/contactUs.svelte';
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
			name: 'Eniola Awotunde',
			role: 'CEO, Broglux (E-commerce)',
			badge: '+62% Higher AOV',
			metric: 'Pricing Model Validated',
			avatar: '/images/profile2.jpg',
			summary:
				'The customer willingness-to-pay research Nivabit conducted completely reshaped our product pricing strategy and luxury inventory mix — lifting average order value before our full rollout.',
			calloutTitle: 'WTP Pricing Shift',
			calloutMetric: '+62% margin expansion',
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

	const trustedTeams = [
		{ name: 'Facity', sector: 'Fintech • 2 wks', initials: 'FA' },
		{ name: 'Tichly', sector: 'EdTech • 3 wks', initials: 'TI' },
		{ name: 'Broglux', sector: 'E-commerce • 2 wks', initials: 'BR' },
		{ name: 'HealthPulse', sector: 'Digital Health • 4 wks', initials: 'HP' },
		{ name: 'Grace Inc.', sector: 'Consumer • 2 wks', initials: 'GR' },
		{ name: 'PayStackr', sector: 'B2B Payments', initials: 'PS' },
		{ name: 'Kova Labs', sector: 'AI Workflow', initials: 'KL' },
		{ name: 'VeriFleet', sector: 'Logistics SaaS', initials: 'VF' },
		{ name: 'Noma Care', sector: 'Telehealth', initials: 'NC' },
		{ name: 'CredoFlow', sector: 'Embedded Fin', initials: 'CF' },
		{ name: 'Looma Studio', sector: 'Venture Studio', initials: 'LS' },
		{ name: 'MetricGrid', sector: 'DevTools', initials: 'MG' },
		{ name: 'SabiTrade', sector: 'B2B Commerce', initials: 'ST' },
		{ name: 'Aurelia AI', sector: 'Enterprise AI', initials: 'AA' },
		{ name: 'PulseOps', sector: 'Cloud Infra', initials: 'PO' }
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
				'The customer willingness-to-pay research Nivabit conducted completely reshaped our product pricing strategy and luxury inventory mix. An invaluable partner for any founder.',
			name: 'Eniola Awotunde',
			role: 'CEO, Broglux',
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
			title: 'Broglux',
			duration: '2 weeks',
			type: 'Willingness-to-Pay Testing',
			category: 'E-commerce',
			outcome: '+62% AOV lift from repriced luxury catalog',
			image: '/images/project/Project-8.png'
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

	<!-- 2. DARK OBSIDIAN ARCHITECTURE BAND: "Inside the System" (Hub & Spoke) -->
	<section id="system" class="relative overflow-hidden bg-surface-dark px-4 py-20 text-white md:px-8 md:py-28">
		<!-- Subtle dot grid texture -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.06]"
			style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;"
		></div>

		<div class="relative mx-auto max-w-5xl">
			<div class="mx-auto max-w-2xl text-center">
				<span
					class="inline-block rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-bold tracking-wider text-lime-accent uppercase"
				>
					System Architecture
				</span>
				<h2
					class="font-cabinet mt-4 text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-white sm:text-4xl md:text-5xl"
				>
					Inside the Validation OS.
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
					Six interconnected research modules feeding one decisive Go / No-Go engine — built so you
					never gamble runway on guesswork.
				</p>
			</div>

			<!-- Hub & Spoke Visual Layout -->
			<div class="mt-14 space-y-6">
				<!-- Top 3 Satellites -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					{#each systemNodesTop as node}
						<div
							class="rounded-2xl border border-white/10 bg-surface-dark-elevated p-5 transition-colors hover:border-lime-accent/50"
						>
							<div class="mb-2.5 flex items-center gap-2">
								<CheckCircle2 size={15} class="shrink-0 text-lime-accent" />
								<h3 class="font-cabinet text-sm font-bold text-white">{node.title}</h3>
							</div>
							<p class="text-xs leading-relaxed text-white/60">{node.desc}</p>
						</div>
					{/each}
				</div>

				<!-- Connector Lines + Central Hub -->
				<div class="relative flex flex-col items-center py-2">
					<div class="hidden h-6 w-px bg-lime-accent/40 md:block"></div>

					<div
						class="w-full max-w-md rounded-2xl border-2 border-lime-accent bg-[#16190E] p-6 text-center shadow-[0_0_50px_rgba(200,243,29,0.12)]"
					>
						<span
							class="inline-block rounded-full bg-lime-accent px-3 py-0.5 text-[10px] font-black tracking-wider text-ink-primary uppercase"
						>
							Core Engine
						</span>
						<h3 class="font-cabinet mt-3 text-xl font-extrabold text-white md:text-2xl">
							Nivabit Validation OS
						</h3>
						<p class="mt-1.5 text-xs leading-relaxed text-white/70">
							Synthesizes competitor gaps, live smoke-test conversions, and 20+ buyer interviews
							into a single data-backed verdict in 14 days.
						</p>
					</div>

					<div class="hidden h-6 w-px bg-lime-accent/40 md:block"></div>
				</div>

				<!-- Bottom 3 Satellites -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					{#each systemNodesBottom as node}
						<div
							class="rounded-2xl border border-white/10 bg-surface-dark-elevated p-5 transition-colors hover:border-lime-accent/50"
						>
							<div class="mb-2.5 flex items-center gap-2">
								<CheckCircle2 size={15} class="shrink-0 text-lime-accent" />
								<h3 class="font-cabinet text-sm font-bold text-white">{node.title}</h3>
							</div>
							<p class="text-xs leading-relaxed text-white/60">{node.desc}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- 3. LIGHT 2x2 BENTO FEATURE GRID: "You get a done-for-you validation team." -->
	<section id="services" class="bg-surface-light px-4 py-20 md:px-8 md:py-28">
		<div class="mx-auto max-w-5xl">
			<div class="mx-auto max-w-2xl text-center">
				<span
					class="inline-block rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-bold tracking-wide text-ink-primary uppercase"
				>
					Validation Programs
				</span>
				<h2
					class="font-cabinet mt-4 text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-ink-primary sm:text-4xl md:text-5xl"
				>
					You get a done-for-you validation team.
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-ink-secondary md:text-base">
					Productized research sprints engineered for founders, venture builders, and enterprise
					innovation leads.
				</p>
			</div>

			<!-- 2x2 Split Horizontal Cards (Matches Reference) -->
			<div class="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
				{#each bentoPrograms as program}
					<div
						class="group flex flex-col justify-between gap-5 rounded-3xl border border-black/8 bg-white p-6 shadow-xs transition-all duration-300 hover:border-black/20 hover:shadow-md sm:flex-row sm:items-center"
					>
						<div class="flex-1 space-y-3">
							<div class="flex items-center gap-2">
								<span
									class="inline-flex items-center gap-1 rounded-full bg-lime-soft px-2.5 py-0.5 text-[11px] font-bold text-ink-primary"
								>
									<Clock size={11} />
									{program.duration}
								</span>
							</div>
							<h3 class="font-cabinet text-xl font-extrabold text-ink-primary">
								{program.title}
							</h3>
							<p class="text-xs leading-relaxed text-ink-secondary">
								{program.desc}
							</p>
							<div class="flex flex-wrap gap-1.5 pt-1">
								{#each program.tags as tag}
									<span
										class="rounded-full border border-black/8 bg-surface-light px-2.5 py-0.5 text-[10px] font-semibold text-ink-secondary"
									>
										{tag}
									</span>
								{/each}
							</div>
						</div>

						<!-- Right Preview Thumbnail -->
						<div
							class="h-36 w-full shrink-0 overflow-hidden rounded-2xl border border-black/8 bg-surface-dark sm:h-40 sm:w-36"
						>
							<img
								src={program.image}
								alt={program.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- 4. FULL-BLEED ELECTRIC LIME CTA STRIP -->
	<section class="bg-lime-accent px-4 py-14 md:px-8 md:py-16">
		<div class="mx-auto max-w-3xl text-center">
			<h2
				class="font-cabinet text-2xl leading-[1.1] font-extrabold tracking-[-0.025em] text-ink-primary sm:text-3xl md:text-4xl"
			>
				You focus on building what wins. We prove the demand first.
			</h2>
			<p class="mx-auto mt-3 max-w-xl text-sm font-medium text-ink-primary/75">
				Stop guessing whether customers will pay. Scope a 14-day sprint and get hard market proof
				before committing engineering capital.
			</p>
			<div class="mt-6">
				<a
					href="/#contact"
					class="inline-flex items-center gap-2 rounded-full bg-ink-primary px-6 py-3 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-black/85 md:text-sm"
				>
					Request a Validation Audit
					<ArrowRight size={15} />
				</a>
			</div>
		</div>
	</section>

	<!-- 5. CUSTOM RESEARCH PROTOCOLS TREE DIAGRAM -->
	<Process />

	<!-- 6. CASE STUDIES WITH LIME SVG AREA GROWTH CHARTS (Signature Reference Section) -->
	<section id="results" class="bg-surface-light px-4 py-20 md:px-8 md:py-28">
		<div class="mx-auto max-w-4xl">
			<div class="mx-auto max-w-2xl text-center">
				<span
					class="inline-block rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-bold tracking-wide text-ink-primary uppercase"
				>
					Proven Outcomes
				</span>
				<h2
					class="font-cabinet mt-4 text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-ink-primary sm:text-4xl md:text-5xl"
				>
					We’ve helped founders prove demand &amp; save months of runway.
				</h2>
			</div>

			<div class="mt-12 space-y-6">
				{#each caseStudyCharts as study, idx}
					<article
						class="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 shadow-xs md:p-8"
					>
						<!-- Top Founder & Metric Header -->
						<div class="flex flex-col gap-5 sm:flex-row sm:items-start">
							<img
								src={study.avatar}
								alt={study.name}
								class="h-16 w-16 shrink-0 rounded-2xl border border-black/10 object-cover sm:h-20 sm:w-20"
							/>
							<div class="flex-1 space-y-2">
								<div class="flex flex-wrap items-center gap-2">
									<h3 class="font-cabinet text-lg font-extrabold text-ink-primary">
										{study.name}
									</h3>
									<span
										class="rounded-full bg-lime-accent px-2.5 py-0.5 text-[11px] font-bold text-ink-primary"
									>
										{study.badge}
									</span>
									<span
										class="rounded-full bg-surface-light px-2.5 py-0.5 text-[11px] font-semibold text-ink-secondary"
									>
										{study.role}
									</span>
								</div>
								<p class="text-sm leading-relaxed text-ink-secondary">
									“{study.summary}”
								</p>
							</div>
						</div>

						<!-- Lime Gradient Area Chart -->
						<div class="relative mt-6 rounded-2xl border border-black/6 bg-[#FCFDF9] p-4 pt-6">
							<!-- Floating Dark Callout Pill (like reference) -->
							<div
								class="mb-3 inline-flex items-center gap-2 rounded-xl bg-surface-dark px-3.5 py-2 text-white shadow-sm sm:absolute sm:top-5 sm:left-[44%] sm:mb-0"
							>
								<TrendingUp size={13} class="text-lime-accent" />
								<div class="text-left leading-tight">
									<p class="text-[10px] font-semibold text-white/60">{study.calloutTitle}</p>
									<p class="font-cabinet text-xs font-bold text-lime-accent">
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
									<linearGradient id={`limeArea-${idx}`} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stop-color="#C8F31D" stop-opacity="0.55" />
										<stop offset="100%" stop-color="#C8F31D" stop-opacity="0.02" />
									</linearGradient>
								</defs>

								<!-- Horizontal guide lines -->
								<line x1="24" y1="36" x2="576" y2="36" stroke="#EAEAE4" stroke-dasharray="4 4" />
								<line x1="24" y1="96" x2="576" y2="96" stroke="#EAEAE4" stroke-dasharray="4 4" />
								<line x1="24" y1="156" x2="576" y2="156" stroke="#E2E2DA" />

								<!-- Area fill -->
								<path d={study.areaD} fill={`url(#limeArea-${idx})`} />

								<!-- Curve stroke -->
								<path
									d={study.pathD}
									fill="none"
									stroke="#8CB800"
									stroke-width="2.5"
									stroke-linecap="round"
								/>

								<!-- Sprint Inflection Marker -->
								<line
									x1={study.markerX}
									y1={study.markerY}
									x2={study.markerX}
									y2="156"
									stroke="#111111"
									stroke-opacity="0.2"
									stroke-dasharray="3 3"
								/>
								<circle
									cx={study.markerX}
									cy={study.markerY}
									r="5"
									fill="#111111"
									stroke="#C8F31D"
									stroke-width="2.5"
								/>

								<!-- End Peak Marker -->
								<circle
									cx="576"
									cy={study.endY}
									r="5"
									fill="#C8F31D"
									stroke="#111111"
									stroke-width="2"
								/>

								<!-- X-Axis Labels -->
								{#each study.xLabels as label, i}
									<text
										x={24 + i * 110.4}
										y="171"
										text-anchor="middle"
										class="fill-[#787872] text-[10px] font-medium"
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
							class="inline-flex items-center gap-2 rounded-full bg-lime-accent px-6 py-3 text-xs font-bold text-ink-primary transition-all hover:bg-lime-accent-hover md:text-sm"
						>
							Scope Your Sprint
							<ArrowRight size={15} strokeWidth={2.5} />
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 8. COMPACT TRUSTED FOUNDERS / VENTURE TEAMS GRID -->
	<section class="bg-surface-light px-4 py-16 md:px-8 md:py-20">
		<div class="mx-auto max-w-5xl">
			<div class="mb-10 text-center">
				<h2
					class="font-cabinet text-2xl font-extrabold tracking-[-0.02em] text-ink-primary sm:text-3xl"
				>
					Trusted across 15+ high-growth verticals
				</h2>
			</div>

			<div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
				{#each trustedTeams as team}
					<div
						class="flex items-center gap-2.5 rounded-xl border border-black/8 bg-white px-3 py-2.5 shadow-2xs transition-colors hover:border-black/20"
					>
						<span
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-dark text-[10px] font-extrabold text-lime-accent"
						>
							{team.initials}
						</span>
						<div class="min-w-0">
							<p class="truncate font-cabinet text-xs font-bold text-ink-primary">{team.name}</p>
							<p class="truncate text-[10px] text-ink-muted">{team.sector}</p>
						</div>
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
						class="inline-flex items-center gap-1.5 text-xs font-bold text-ink-primary underline decoration-lime-accent decoration-2 underline-offset-4 hover:opacity-75"
					>
						Request sample dossier
						<ArrowUpRight size={14} />
					</a>
				</div>

				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{#each projects as project}
						<div
							class="group overflow-hidden rounded-2xl border border-black/8 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-md"
						>
							<div class="relative h-40 w-full overflow-hidden bg-surface-dark">
								<img
									src={project.image}
									alt={project.title}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<span
									class="absolute top-3 left-3 rounded-full bg-lime-accent px-2.5 py-0.5 text-[10px] font-extrabold text-ink-primary"
								>
									{project.category}
								</span>
							</div>
							<div class="space-y-2 p-4">
								<div class="flex items-center justify-between">
									<h4 class="font-cabinet text-base font-extrabold text-ink-primary">
										{project.title}
									</h4>
									<span class="text-[11px] font-semibold text-ink-muted">{project.duration}</span>
								</div>
								<p class="text-[11px] font-semibold text-ink-primary/80">{project.type}</p>
								<p class="text-xs leading-snug text-ink-secondary">{project.outcome}</p>
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

	<!-- 12. FINAL OVERLAPPING-AVATAR CTA BAND (Matches Reference Bottom Band) -->
	<section class="bg-white px-4 py-20 text-center md:px-8 md:py-24">
		<div class="mx-auto max-w-2xl">
			<!-- Overlapping Founder Avatars -->
			<div class="mb-5 flex items-center justify-center -space-x-2.5">
				<img
					src="/images/profile1.png"
					alt="Founder"
					class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
				/>
				<img
					src="/images/profile2.jpg"
					alt="Founder"
					class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
				/>
				<img
					src="/images/profile3.jpg"
					alt="Founder"
					class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
				/>
			</div>

			<h2
				class="font-cabinet text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-ink-primary sm:text-4xl md:text-5xl"
			>
				Ready to validate before you build?
			</h2>
			<p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-secondary md:text-base">
				Book a 30-minute scoping call. We’ll map your riskiest assumptions and show you how to prove
				demand in 14 days.
			</p>

			<div class="mt-7 flex flex-wrap items-center justify-center gap-3">
				<a
					href="https://calendly.com/groupnivabit/30min"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-full bg-lime-accent px-7 py-3.5 text-sm font-bold text-ink-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-lime-accent-hover hover:shadow-md"
				>
					Book Your Discovery Call
					<ArrowUpRight size={16} strokeWidth={2.5} />
				</a>
			</div>

			<p class="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted">
				<ShieldCheck size={14} class="text-ink-primary" />
				No obligation • Confidential NDA available on request
			</p>
		</div>
	</section>
</div>
