<script lang="ts">
	import { Menu, X, ArrowUpRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import NivabitLogo from '#lib/components/icon/NivabitLogo.svelte';
	import { bookingModal } from '#lib/stores/bookingModal.svelte.ts';

	let isMenuOpen = $state(false);
	let scrolled = $state(false);

	const navLinks = [
		{ label: 'System', id: 'system', href: '/#system' },
		{ label: 'Programs', id: 'services', href: '/#services' },
		{ label: 'Results', id: 'results', href: '/#results' },
		{ label: 'The Memo', id: 'newsletter', href: '/#newsletter' },
		{ label: 'Research', id: null, href: '/articles' },
		{ label: 'Contact', id: 'contact', href: '/#contact' }
	];

	const closeMenu = () => {
		isMenuOpen = false;
	};

	const scrollToSection = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const handleNavClick = async (e: MouseEvent, link: (typeof navLinks)[number]) => {
		closeMenu();
		if (!link.id) return;
		const currentPath = page.url.pathname;
		if (currentPath === '/') {
			e.preventDefault();
			scrollToSection(link.id);
		} else {
			e.preventDefault();
			await goto(`/#${link.id}`);
		}
	};

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 16;
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		const urlParams = new URLSearchParams(window.location.search);
		const sectionId = urlParams.get('section');
		if (sectionId) {
			setTimeout(() => scrollToSection(sectionId), 200);
		}

		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<header class="sticky top-0 z-50 w-full px-4 pt-4 pb-2 transition-all">
	<div
		class={`mx-auto flex max-w-5xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-300 md:px-4 ${
			scrolled
				? 'border-black/10 bg-white/95 shadow-lg shadow-black/[0.04] backdrop-blur-md'
				: 'border-black/8 bg-white/90 shadow-sm backdrop-blur-md'
		}`}
	>
		<!-- Brand Mark -->
		<a href="/" class="flex items-center pl-2" aria-label="Nivabit Home">
			<NivabitLogo variant="dark" class="text-lg" />
		</a>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center gap-1 lg:flex" aria-label="Primary">
			{#each navLinks as link}
				<a
					href={link.href}
					onclick={(e) => handleNavClick(e, link)}
					class="rounded-full px-3.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-black/[0.04] hover:text-ink-primary"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- CTA & Mobile Toggle -->
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={bookingModal.open}
				class="hidden cursor-pointer items-center gap-1.5 rounded-full bg-[#2563eb] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#1d4ed8] hover:shadow-sm lg:inline-flex"
			>
				Book a Call
				<ArrowUpRight size={14} strokeWidth={2.5} />
			</button>

			<button
				type="button"
				class="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-primary transition-colors hover:bg-black/5 lg:hidden"
				onclick={() => (isMenuOpen = !isMenuOpen)}
				aria-label="Toggle Menu"
				aria-expanded={isMenuOpen}
			>
				{#if isMenuOpen}
					<X size={18} />
				{:else}
					<Menu size={18} />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Menu Dropdown -->
	{#if isMenuOpen}
		<div
			class="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-black/10 bg-white p-4 shadow-xl lg:hidden"
		>
			<nav class="flex flex-col gap-1">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={(e) => handleNavClick(e, link)}
						class="rounded-2xl px-4 py-3 text-sm font-medium text-ink-primary transition-colors hover:bg-surface-light"
					>
						{link.label}
					</a>
				{/each}
				<button
					type="button"
					onclick={() => {
						closeMenu();
						bookingModal.open();
					}}
					class="mt-2 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-brand-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-accent-hover"
				>
					Book a Discovery Call
					<ArrowUpRight size={16} strokeWidth={2.5} />
				</button>
			</nav>
		</div>
	{/if}
</header>
