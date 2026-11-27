<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/env';
	import { page } from '$app/state';

	import type { Snippet } from 'svelte';
	import ProgressSpinner from '#lib/components/loader/ProgressSpinner.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.ts';
	import BookingModal from '#lib/components/booking/BookingModal.svelte';
	import { bookingModal } from '#lib/stores/bookingModal.svelte.ts';

	let { children, data }: { data: { pathname: string }; children: Snippet } = $props();

	function checkBookingUrl() {
		if (!browser) return;
		const url = new URL(window.location.href);
		if (url.pathname.startsWith('/ceo')) return;

		const bookParam = url.searchParams.get('book');
		const hasBookQuery =
			url.searchParams.has('book') && bookParam !== 'false' && bookParam !== '0';
		const hasBookHash = url.hash.toLowerCase() === '#book';

		if (hasBookQuery || hasBookHash) {
			if (hasBookQuery) url.searchParams.delete('book');
			if (hasBookHash) url.hash = '';
			const cleanUrl = `${url.pathname}${url.search}${url.hash}` || '/';
			bookingModal.openFromUrl(cleanUrl);
		}
	}

	afterNavigate(() => {
		checkBookingUrl();
	});

	onMount(() => {
		const onHashChange = () => checkBookingUrl();

		const onDocumentClick = (e: MouseEvent) => {
			if (
				e.defaultPrevented ||
				e.button !== 0 ||
				e.metaKey ||
				e.ctrlKey ||
				e.shiftKey ||
				e.altKey
			) {
				return;
			}
			const target = e.target as HTMLElement | null;
			const anchor = target?.closest('a');
			if (!anchor || anchor.target === '_blank') return;

			const rawHref = anchor.getAttribute('href');
			if (!rawHref) return;

			try {
				const resolved = new URL(rawHref, window.location.href);
				if (resolved.origin !== window.location.origin) return;
				if (window.location.pathname.startsWith('/ceo')) return;

				const isSamePageBookHash =
					resolved.hash.toLowerCase() === '#book' &&
					resolved.pathname === window.location.pathname;
				const isBookPath = resolved.pathname === '/book';

				if (isSamePageBookHash || isBookPath) {
					e.preventDefault();
					bookingModal.open('/book');
				}
			} catch {
				// Ignore malformed URLs
			}
		};

		window.addEventListener('hashchange', onHashChange);
		document.addEventListener('click', onDocumentClick);

		return () => {
			window.removeEventListener('hashchange', onHashChange);
			document.removeEventListener('click', onDocumentClick);
		};
	});
</script>

<Toaster theme="light" position="bottom-right" />
<ProgressSpinner />

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

{#key data.pathname}
	<main in:fly={{ easing: cubicOut, y: 10, duration: 100, delay: 100 }}>
		{@render children()}
	</main>
{/key}

{#if !page.url.pathname.startsWith('/ceo')}
	<BookingModal open={bookingModal.isOpen} onClose={bookingModal.close} />
{/if}
