<script lang="ts">
	import Header from '#lib/components/layout/Header.svelte';
	import Footer from '#lib/components/layout/footer.svelte';
</script>

<svelte:head>
	<title>Terms of Service | Nivabit</title>
	<meta
		name="description"
		content="Terms of Service governing use of the Nivabit website, strategy call scheduling, and validation or engineering engagements."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-light text-ink-primary">
	<Header />

	<!-- Hero Header -->
	<section class="bg-surface-dark px-4 pt-16 pb-16 text-white md:px-8 md:pt-24 md:pb-20">
		<div class="mx-auto max-w-3xl">
			<span
				class="inline-flex items-center gap-1.5 rounded-md border border-brand-accent/40 bg-brand-accent/15 px-3 py-1 text-xs font-semibold tracking-wider text-brand-accent-light uppercase"
			>
				<span class="h-1.5 w-1.5 rounded-[1px] bg-brand-accent-light"></span>
				Legal Agreement
			</span>
			<h1 class="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
				Terms of Service
			</h1>
			<p class="mt-3 text-sm text-slate-400">
				Last updated: November 27, 2026
			</p>
		</div>
	</section>

	<!-- Content -->
	<section class="flex-1 bg-surface-light px-4 py-12 md:px-8 md:py-16">
		<div class="mx-auto max-w-3xl space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:p-10">
			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					By accessing <strong>nivabit.com</strong>, booking a strategy call, submitting a scoping
					inquiry, or subscribing to our publications, you agree to these Terms of Service and our
					<a href="/privacy" class="font-semibold text-[#2563eb] hover:underline">Privacy Policy</a>.
					If you do not agree, please discontinue use of the site.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">2. Scope of Services</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					Nivabit provides product idea validation, customer discovery, pricing elasticity research,
					opportunity dossiers, and production software engineering. Website content and initial
					strategy calls are informational; specific deliverables, timelines, fees, and milestones
					for any paid engagement are governed by a separate written Statement of Work (SOW) or
					Master Services Agreement (MSA).
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">3. Strategy Calls &amp; Submissions</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					When scheduling a call or submitting a contact request, you agree to provide accurate
					contact information (name, email, and phone number). Strategy calls are complimentary and
					non-binding; either party may reschedule with reasonable notice.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">4. Intellectual Property &amp; Idea Ownership</h2>
				<ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
					<li>
						<strong>Your Ideas:</strong> You retain 100% ownership of all product concepts,
						hypotheses, and business information you share with Nivabit.
					</li>
					<li>
						<strong>Client Deliverables:</strong> Ownership of custom research dossiers, reports,
						and engineered software transfers to the client upon full payment as specified in the
						applicable SOW.
					</li>
					<li>
						<strong>Site Content:</strong> All Nivabit branding, frameworks, articles, and
						published research on this website remain the intellectual property of Nivabit.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">5. Acceptable Use</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					You agree not to submit automated spam, scrape our site, attempt unauthorized access to
					administrative routes, or use our forms to transmit unlawful, misleading, or malicious
					content. We reserve the right to block or rate-limit abusive traffic.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">6. Disclaimers &amp; Limitation of Liability</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					Market validation research and dossiers are evidence-based decision tools and do not
					constitute financial, legal, or investment guarantees. To the maximum extent permitted by
					law, Nivabit is not liable for indirect, incidental, or consequential damages arising from
					use of this website or reliance on published articles.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">7. Governing Law &amp; Updates</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					These Terms are governed by the laws of the Federal Republic of Nigeria. We may update
					these Terms periodically; continued use of the site after updates constitutes acceptance.
				</p>
			</section>

			<section class="space-y-3 border-t border-slate-200 pt-6">
				<h2 class="text-lg font-bold text-slate-900">8. Contact</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					Questions about these Terms? Reach us at
					<a href="mailto:contact@nivabit.com" class="font-semibold text-[#2563eb] hover:underline">
						contact@nivabit.com
					</a>.
				</p>
			</section>
		</div>
	</section>

	<Footer />
</div>
