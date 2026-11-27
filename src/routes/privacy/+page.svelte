<script lang="ts">
	import Header from '#lib/components/layout/Header.svelte';
	import Footer from '#lib/components/layout/footer.svelte';
</script>

<svelte:head>
	<title>Privacy Policy | Nivabit</title>
	<meta
		name="description"
		content="How Nivabit collects, uses, and protects your personal data across strategy call bookings, contact inquiries, and The Validation Memo."
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
				Legal &amp; Data Protection
			</span>
			<h1 class="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
				Privacy Policy
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
				<h2 class="text-lg font-bold text-slate-900">1. Overview</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					Nivabit ("we," "our," or "us") is a product validation, market research, and software
					engineering studio. This Privacy Policy explains what personal data we collect when you
					visit <strong>nivabit.com</strong>, book a strategy call, submit a contact inquiry, or
					subscribe to The Validation Memo, and how we protect and use that information.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">2. Information We Collect</h2>
				<ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
					<li>
						<strong>Strategy Call Bookings:</strong> Your first and last name, email address, phone
						number (including country code), preferred date/time slot, browser timezone, and any
						optional product notes you share.
					</li>
					<li>
						<strong>Contact Inquiries:</strong> Your name, work email, selected validation modules,
						and message details submitted through our sprint scoping form.
					</li>
					<li>
						<strong>Newsletter Subscriptions:</strong> Your email address when you opt in to The
						Validation Memo or request the Software Validation Dossier.
					</li>
					<li>
						<strong>Technical &amp; Security Data:</strong> IP addresses processed transiently for
						anti-spam rate limiting, plus standard analytics/pixel data (including Meta Pixel) to
						measure site traffic and campaign effectiveness.
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">3. How We Use Your Data</h2>
				<ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
					<li>Schedule and conduct your requested strategy call and send calendar/email confirmations.</li>
					<li>Respond to your project scoping inquiries and deliver requested proposals or dossiers.</li>
					<li>Send weekly research breakdowns and market teardowns if you subscribed to The Validation Memo.</li>
					<li>Prevent automated spam, abuse, and unauthorized access to our systems.</li>
				</ul>
				<p class="text-sm leading-relaxed text-slate-600">
					We <strong>never sell, rent, or trade</strong> your personal contact details or product
					hypotheses to third parties.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">4. Confidentiality of Product Ideas</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					Any software concept, hypothesis, or business context you submit through our booking modal
					or contact form is treated as strictly confidential and used solely to evaluate and scope
					your validation engagement. Mutual NDAs are available on request before sharing sensitive
					materials.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">5. Data Retention &amp; Security</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					We store booking, contact, and subscriber records in secured PostgreSQL databases over
					encrypted connections. We retain your data only as long as needed to fulfill the purpose
					for which it was collected, maintain client records, or comply with legal obligations.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-lg font-bold text-slate-900">6. Your Privacy Rights (NDPA &amp; GDPR)</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					Depending on your jurisdiction (including under the Nigeria Data Protection Act and GDPR),
					you have the right to:
				</p>
				<ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
					<li>Request a copy of the personal data we hold about you.</li>
					<li>Request correction of inaccurate information or deletion of your records.</li>
					<li>Unsubscribe from The Validation Memo at any time by replying or emailing us.</li>
					<li>Disable non-essential cookies and tracking pixels through your browser settings.</li>
				</ul>
			</section>

			<section class="space-y-3 border-t border-slate-200 pt-6">
				<h2 class="text-lg font-bold text-slate-900">7. Contact Us</h2>
				<p class="text-sm leading-relaxed text-slate-600">
					To exercise your data rights or ask questions about this Privacy Policy, contact us at:
				</p>
				<div class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
					<p class="font-bold text-slate-900">Nivabit</p>
					<p>
						Email:
						<a href="mailto:contact@nivabit.com" class="font-semibold text-[#2563eb] hover:underline">
							contact@nivabit.com
						</a>
					</p>
					<p>Phone: +234 906 680 9821</p>
				</div>
			</section>
		</div>
	</section>

	<Footer />
</div>
