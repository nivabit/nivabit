<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Check, ArrowRight } from 'lucide-svelte';
	import { subscribeNewsletter } from '#lib/remote/newsletter.remote.ts';
	import { subscribeNewsletterSchema } from '#lib/validation/validation.ts';
	import NivabitLogo from '#lib/components/icon/NivabitLogo.svelte';
	import BookingModal from '#lib/components/booking/BookingModal.svelte';
	import { bookingModal } from '#lib/stores/bookingModal.svelte.ts';

	function openWhatsApp() {
		const part1 = '234';
		const part2 = '906';
		const part3 = '680';
		const part4 = '9821';
		const number = `${part1}${part2}${part3}${part4}`;
		const text = encodeURIComponent('Hello, I would like to book a Validation Sprint for my software concept.');
		window.open(`https://wa.me/${number}?text=${text}`, '_blank');
	}
</script>

<svelte:head>
	<title>14-Day Software Validation Dossier | Nivabit</title>
	<meta
		name="description"
		content="Get the 14-Day Software Validation Dossier and Pre-Code Buyer Discovery Checklist. Test customer demand before writing code."
	/>
</svelte:head>

<div class="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-[#2563eb]/15 selection:text-[#2563eb]">
	<!-- Top Minimal Navbar with Official Nivabit Logo -->
	<header class="sticky top-0 z-50 px-4 pt-4 md:px-8">
		<div
			class="mx-auto flex max-w-6xl items-center justify-between rounded-xl border border-slate-200/80 bg-white/95 px-5 py-3 shadow-[0_4px_20px_-4px_rgba(37, 99, 235,0.06)] backdrop-blur-md"
		>
			<!-- Official Nivabit Brand Mark -->
			<a href="/" class="flex items-center transition-opacity hover:opacity-85">
				<NivabitLogo variant="dark" class="h-7 w-auto" />
			</a>

			<!-- Navigation Links -->
			<nav class="hidden items-center gap-8 md:flex">
				<a
					href="/#system"
					class="text-xs font-semibold tracking-wider text-slate-600 uppercase transition-colors hover:text-[#2563eb]"
				>
					Validation Sprint
				</a>
				<a
					href="/#evidence"
					class="text-xs font-semibold tracking-wider text-slate-600 uppercase transition-colors hover:text-[#2563eb]"
				>
					Case Studies
				</a>
				<a
					href="/#about"
					class="text-xs font-semibold tracking-wider text-slate-600 uppercase transition-colors hover:text-[#2563eb]"
				>
					About
				</a>
			</nav>

			<!-- Top Right Action -->
			<div class="flex items-center gap-3">
				<button
					onclick={bookingModal.open}
					class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2563eb]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8] hover:shadow-md active:translate-y-0 active:scale-95"
				>
					Book a Call
				</button>
			</div>
		</div>
	</header>

	<!-- Main Hero Section -->
	<main class="relative overflow-hidden px-4 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
		<div class="mx-auto max-w-6xl">
			<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
				<!-- Left Hero Copy & Subscription Form -->
				<div class="lg:col-span-7">
					<!-- Bit-Inspired Eyebrow Badge (Single clean square bit indicator) -->
					<div
						class="inline-flex items-center gap-2 rounded-md border border-slate-200/80 bg-white px-3 py-1 text-[11px] font-medium tracking-wider text-slate-700 shadow-xs"
					>
						<span class="h-2 w-2 rounded-[1.5px] bg-[#2563eb]"></span>
						<span class="font-semibold text-slate-800">THE VALIDATION MEMO</span>
						<span class="text-slate-300">/</span>
						<span class="font-mono font-bold text-[#2563eb]">FREE</span>
					</div>

					<!-- Bold Display Headline -->
					<h1
						class="font-cabinet mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl"
					>
						Build trust.<br />
						Test the demand.<br />
						Build what <span class="text-[#2563eb]">sells</span>.
					</h1>

					<!-- Subhead -->
					<p class="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
						A weekly teardown for founders building software with verified customer demand, not guesswork.
						Subscribe and get the <strong class="text-slate-900">14-Day Software Validation Dossier</strong> plus the
						<strong class="text-slate-900">Pre-Code Buyer Discovery Checklist</strong>.
					</p>

					<!-- Newsletter Form -->
					<div class="mt-8">
						<form
							class="w-full max-w-md"
							{...subscribeNewsletter.preflight(subscribeNewsletterSchema).enhance(async ({ form, submit }) => {
								const ok = await submit();
								if (!ok) return;
								toast.success('You’re in! Check your email for the Validation Dossier.');
								form.reset();
							})}
							oninput={() => subscribeNewsletter.validate()}
						>
							{#each subscribeNewsletter.fields.email.issues() as issue}
								<div class="mb-3 rounded-lg border border-red-500/30 bg-red-50 px-3.5 py-2 text-xs text-red-600">
									{issue.message}
								</div>
							{/each}

							<div
								class="flex flex-col gap-2.5 rounded-xl border border-slate-300 bg-white p-1.5 shadow-sm transition-all focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20 sm:flex-row sm:items-center"
							>
								<input
									required
									type="email"
									{...subscribeNewsletter.fields.email.as('email')}
									placeholder="Enter your email..."
									class="w-full flex-1 rounded-lg bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
								/>

								<button
									disabled={Boolean(subscribeNewsletter.pending)}
									type="submit"
									class="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] px-6 py-3 text-xs font-bold text-white shadow-md shadow-[#2563eb]/20 transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-[#2563eb]/25 disabled:opacity-50"
								>
									{#if subscribeNewsletter.pending}
										Sending...
									{:else}
										Get The Framework
										<ArrowRight class="h-3.5 w-3.5" strokeWidth={2.5} />
									{/if}
								</button>
							</div>
						</form>

						<!-- Micro-Proof Checklist -->
						<div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
							<span class="inline-flex items-center gap-1.5">
								<Check class="h-3.5 w-3.5 text-[#2563eb]" strokeWidth={3} />
								2-min read
							</span>
							<span class="inline-flex items-center gap-1.5">
								<Check class="h-3.5 w-3.5 text-[#2563eb]" strokeWidth={3} />
								0% fluff
							</span>
							<span class="inline-flex items-center gap-1.5">
								<Check class="h-3.5 w-3.5 text-[#2563eb]" strokeWidth={3} />
								Easy to implement
							</span>
						</div>

						<!-- Avatar Stack + Subscriber Count -->
						<div class="mt-6 flex items-center gap-3">
							<div class="flex -space-x-2 overflow-hidden">
								<img
									class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
									src="/images/profile2.jpg"
									alt="Eniola Awotunde"
								/>
								<img
									class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
									src="/images/profile3.jpg"
									alt="Allen Abu"
								/>
								<img
									class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
									src="/images/temiloluwa.jpg"
									alt="Temiloluwa Olaniyan"
								/>
								<img
									class="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
									src="/images/imisi.jpg"
									alt="ImisiOluwa"
								/>
							</div>
							<p class="text-xs font-medium text-slate-600">
								Join <span class="font-bold text-slate-900">2,500+ founders</span> getting one framework a week.
							</p>
						</div>
					</div>
				</div>

				<!-- Right 3D Framework Dossier Mockup (Bit-Matrix Theme) -->
				<div class="relative flex items-center justify-center py-6 lg:col-span-5 lg:justify-end">
					<!-- Ambient Glow Anchor -->
					<div
						class="pointer-events-none absolute h-72 w-72 rounded-full bg-[#2563eb]/18 blur-3xl"
						aria-hidden="true"
					></div>

					<!-- Floating Testimonial Bubble 1 (Top Left) -->
					<div
						class="absolute -top-3 left-0 z-20 flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-xs transition-transform hover:scale-105 sm:-left-4"
					>
						<img
							src="/images/profile2.jpg"
							alt="Eniola Awotunde"
							class="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
						/>
						<span class="text-xs font-bold text-slate-800">“Saved us 4 months of dev”</span>
					</div>

					<!-- Floating Testimonial Bubble 2 (Right Middle) -->
					<div
						class="absolute top-1/2 -right-2 z-20 -translate-y-1/2 flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-xs transition-transform hover:scale-105 sm:-right-6"
					>
						<img
							src="/images/profile3.jpg"
							alt="Allen Abu"
							class="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
						/>
						<span class="text-xs font-bold text-slate-800">“Only validation memo I read”</span>
					</div>

					<!-- Floating Testimonial Bubble 3 (Bottom Left) -->
					<div
						class="absolute -bottom-3 left-4 z-20 flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-xs transition-transform hover:scale-105 sm:-left-2"
					>
						<img
							src="/images/temiloluwa.jpg"
							alt="Temiloluwa Olaniyan"
							class="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
						/>
						<span class="text-xs font-bold text-slate-800">“Blown away by the real buyer data”</span>
					</div>

					<!-- 3D Book Graphic (Nivabit Bit-Matrix Engineering) -->
					<div
						class="relative z-10 w-[260px] sm:w-[290px] rotate-[-5deg] rounded-2xl bg-gradient-to-tr from-[#090d14] via-[#0f172a] to-[#1e293b] p-6 shadow-[20px_25px_50px_rgba(37, 99, 235,0.18)] ring-1 ring-white/10 transition-transform duration-500 hover:rotate-0"
					>
						<!-- Book Spine Line -->
						<div
							class="pointer-events-none absolute inset-y-0 left-0 w-3 rounded-l-2xl bg-gradient-to-r from-white/20 to-transparent"
						></div>

						<!-- Book Cover Header with Bit Indicator -->
						<div class="flex items-center gap-2">
							<span class="h-2 w-2 rounded-[1.5px] bg-[#60a5fa]"></span>
							<span class="font-mono text-[10px] font-bold tracking-widest text-[#60a5fa] uppercase">
								NIVABIT // DOSSIER
							</span>
						</div>

						<!-- Book Cover Title -->
						<div class="mt-8 space-y-1">
							<h3 class="font-cabinet text-2xl font-black tracking-tight text-white sm:text-3xl">
								PRE-CODE<br />VALIDATION
							</h3>
						</div>

						<!-- Bit Matrix Grid Visualization -->
						<div class="my-6 rounded-xl border border-white/10 bg-[#090d14]/80 p-4">
							<div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
								<span>DATA SPRINT</span>
								<span class="text-[#60a5fa] font-bold">14 DAYS</span>
							</div>

							<!-- Bit Matrix (Visualizing discrete bits of customer information) -->
							<div class="mt-3 grid grid-cols-8 gap-1">
								<div class="h-2 rounded-[1px] bg-[#2563eb]"></div>
								<div class="h-2 rounded-[1px] bg-[#2563eb]"></div>
								<div class="h-2 rounded-[1px] bg-[#60a5fa]"></div>
								<div class="h-2 rounded-[1px] bg-[#60a5fa]"></div>
								<div class="h-2 rounded-[1px] bg-[#2563eb]"></div>
								<div class="h-2 rounded-[1px] bg-[#2563eb]/40"></div>
								<div class="h-2 rounded-[1px] bg-white/10"></div>
								<div class="h-2 rounded-[1px] bg-[#60a5fa]"></div>
							</div>

							<div class="mt-3 text-[11px] font-medium text-slate-300">
								Demand Scorecard &amp; Buyer Intent Matrix
							</div>
						</div>

						<!-- Book Cover Footer -->
						<div class="border-t border-white/10 pt-4">
							<p class="font-cabinet text-xl font-black tracking-widest text-white uppercase">
								WORKFLOW
							</p>
							<p class="mt-1 text-[10px] text-slate-400">Tested with paying customers before code.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Sleek Dark Footer (Nivabit Surface Dark #090d14) -->
	<footer class="bg-[#090d14] px-4 pt-16 pb-12 text-white md:px-8">
		<div class="mx-auto max-w-6xl">
			<!-- Top Row -->
			<div class="flex flex-col justify-between gap-10 border-b border-white/10 pb-12 lg:flex-row">
				<!-- Brand Column -->
				<div class="max-w-sm space-y-4">
					<div class="flex items-center">
						<NivabitLogo variant="light" class="h-7 w-auto" />
					</div>
					<p class="text-xs leading-relaxed text-slate-400">
						We innovate the bit. The pre-code validation and engineering studio for ambitious founders building profitable software.
					</p>

					<!-- Social Icons -->
					<div class="flex items-center gap-3 pt-2">
						<a
							href="https://x.com"
							target="_blank"
							rel="noreferrer"
							aria-label="X (Twitter)"
							class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-[#2563eb] hover:text-[#60a5fa]"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noreferrer"
							aria-label="LinkedIn"
							class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-[#2563eb] hover:text-[#60a5fa]"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
							</svg>
						</a>
						<button
							onclick={openWhatsApp}
							aria-label="WhatsApp"
							class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-[#2563eb] hover:text-[#60a5fa]"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z"/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Navigation Columns -->
				<div class="grid grid-cols-2 gap-8 sm:grid-cols-2 md:gap-16">
					<div>
						<h4 class="text-xs font-bold tracking-widest text-slate-500 uppercase">PROGRAMS</h4>
						<ul class="mt-4 space-y-2.5 text-xs text-slate-300">
							<li>
								<a href="/#system" class="transition-colors hover:text-[#60a5fa]">
									14-Day Validation Sprint
								</a>
							</li>
							<li>
								<a href="/#pipeline" class="transition-colors hover:text-[#60a5fa]">
									Customer Discovery &amp; WTP
								</a>
							</li>
							<li>
								<a href="/#evidence" class="transition-colors hover:text-[#60a5fa]">
									Production Engineering
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 class="text-xs font-bold tracking-widest text-slate-500 uppercase">CONNECT</h4>
						<ul class="mt-4 space-y-2.5 text-xs text-slate-300">
							<li>
								<button onclick={bookingModal.open} class="cursor-pointer transition-colors hover:text-[#60a5fa]">
									Book a Sprint
								</button>
							</li>
							<li>
								<a href="https://linkedin.com" target="_blank" rel="noreferrer" class="transition-colors hover:text-[#60a5fa]">
									Founder's LinkedIn
								</a>
							</li>
							<li>
								<a href="/#about" class="transition-colors hover:text-[#60a5fa]">
									About Nivabit
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Bottom Row -->
			<div class="flex flex-col items-center justify-between gap-4 pt-8 text-[11px] text-slate-500 sm:flex-row">
				<p>We innovate the bit. One validated system a week.</p>
				<p>© {new Date().getFullYear()} Nivabit. All rights reserved.</p>
			</div>

			<!-- Secondary Legal Links -->
			<div class="mt-6 flex justify-center gap-6 text-[11px] text-slate-600">
				<a href="/#contact" class="hover:text-slate-400">Contact</a>
				<a href="/privacy" class="hover:text-slate-400">Privacy Policy</a>
				<a href="/terms" class="hover:text-slate-400">Terms of Service</a>
			</div>
		</div>
	</footer>

	<!-- In-house Booking & Calendar Modal -->
	<BookingModal bind:open={bookingModal.isOpen} />
</div>
