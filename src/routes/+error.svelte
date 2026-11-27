<script lang="ts">
	import { page } from '$app/state';
	import Header from '#lib/components/layout/Header.svelte';
	import Footer from '#lib/components/layout/footer.svelte';
	import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-svelte';

	const status = $derived(page.status || 404);
	const errorMessage = $derived(page.error?.message);

	const copy = $derived.by(() => {
		if (status === 401 || status === 403) {
			return {
				badge: status === 401 ? 'Session Expired' : 'Access Restricted',
				title: status === 401 ? 'Sign in required' : 'You do not have access',
				description:
					errorMessage ||
					'Your session has expired or you do not have permission to view this page. Sign in to continue.'
			};
		}
		if (status >= 500) {
			return {
				badge: 'Server Error',
				title: 'Something went wrong',
				description:
					errorMessage ||
					'An unexpected error occurred on our end. Please try again in a moment or head back home.'
			};
		}
		return {
			badge: 'Page Not Found',
			title: 'We could not find that page',
			description:
				errorMessage && errorMessage !== 'Not Found'
					? errorMessage
					: "The page you're looking for doesn't exist, was moved, or the URL has a typo."
		};
	});
</script>

<svelte:head>
	<title>{status} — {copy.title} | Nivabit</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-surface-light text-ink-primary">
	<Header />

	<section
		class="relative flex flex-1 items-center justify-center overflow-hidden bg-surface-dark px-4 py-24 text-white md:px-8 md:py-32"
	>
		<!-- Subtle dot grid & ambient royal-blue glow matching Nivabit Precision Design System -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.04]"
			style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute -top-24 left-1/2 h-72 w-[480px] -translate-x-1/2 rounded-full bg-brand-accent/15 blur-3xl"
			aria-hidden="true"
		></div>

		<div class="relative mx-auto max-w-2xl text-center">
			<span
				class="inline-flex items-center gap-1.5 rounded-md border border-brand-accent/40 bg-brand-accent/15 px-3 py-1 text-xs font-semibold tracking-wider text-brand-accent-light uppercase"
			>
				{#if status === 401 || status === 403}
					<ShieldAlert size={13} />
				{:else}
					<span class="h-1.5 w-1.5 rounded-[1px] bg-brand-accent-light"></span>
				{/if}
				{copy.badge}
			</span>

			<h1
				class="mt-6 text-7xl leading-none font-extrabold tracking-tight text-white sm:text-8xl md:text-9xl"
			>
				{status}
			</h1>

			<h2 class="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
				{copy.title}
			</h2>

			<p class="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
				{copy.description}
			</p>

			<div class="mt-9 flex flex-wrap items-center justify-center gap-3.5">
				{#if status === 401}
					<a
						href="/ceo/login"
						class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand-accent px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-accent-hover focus-visible:ring-2 focus-visible:ring-brand-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
					>
						Sign In to CEO Portal
						<ArrowRight size={16} strokeWidth={2.2} />
					</a>
				{/if}

				<a
					href="/"
					class={status === 401
						? 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white'
						: 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand-accent px-7 py-3 text-sm font-bold text-white shadow-md shadow-brand-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-accent-hover focus-visible:ring-2 focus-visible:ring-brand-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark'}
				>
					<ArrowLeft size={16} strokeWidth={2.2} />
					Back to Home
				</a>
			</div>
		</div>
	</section>

	<Footer />
</div>
