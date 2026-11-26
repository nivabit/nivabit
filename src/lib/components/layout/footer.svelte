<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Twitter from '../icon/twitter.svelte';
	import Facebook from '../icon/facebook.svelte';
	import Linkedin from '../icon/linkedin.svelte';
	import Instagram from '../icon/instagram.svelte';
	import Tiktok from '../icon/tiktok.svelte';

	const socialLinks = [
		{ name: 'X / Twitter', icon: Twitter, url: 'https://x.com/@groupnivabit' },
		{ name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/nivabit/' },
		{ name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/groupnivabit/' },
		{ name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/nivabit' },
		{ name: 'TikTok', icon: Tiktok, url: 'https://www.tiktok.com/@nivabit' }
	];

	const navColumns = [
		{
			title: 'System',
			links: [
				{ label: 'Validation OS', id: 'system', href: '/#system' },
				{ label: 'Programs', id: 'services', href: '/#services' },
				{ label: 'Methodology', id: 'process', href: '/#process' },
				{ label: 'Case Studies', id: 'results', href: '/#results' }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'Our Story', id: 'story', href: '/#story' },
				{ label: 'The Memo', id: 'newsletter', href: '/#newsletter' },
				{ label: 'Research', id: null, href: '/articles' },
				{ label: 'Contact', id: 'contact', href: '/#contact' }
			]
		}
	];

	const handleNavClick = async (e: MouseEvent, id: string | null) => {
		if (!id) return;
		const currentPath = page.url.pathname;
		if (currentPath === '/') {
			e.preventDefault();
			const el = document.getElementById(id);
			if (el) el.scrollIntoView({ behavior: 'smooth' });
		} else {
			e.preventDefault();
			await goto(`/#${id}`);
		}
	};
</script>

<footer class="bg-surface-dark text-white">
	<div class="mx-auto max-w-6xl px-4 pt-16 pb-10 md:px-8">
		<div class="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 md:grid-cols-12">
			<!-- Brand Column -->
			<div class="space-y-5 md:col-span-5">
				<a href="/" class="inline-flex items-center gap-2.5">
					<span
						class="flex h-7 w-7 items-center justify-center rounded-full bg-lime-accent text-xs font-black text-ink-primary"
					>
						N
					</span>
					<span class="font-cabinet text-xl font-extrabold tracking-tight text-white">
						Nivabit
					</span>
				</a>
				<p class="max-w-sm text-sm leading-relaxed text-white/60">
					The product idea validation and market research studio. We install evidence-backed
					validation systems so founders prove demand before writing code.
				</p>
				<div class="flex items-center gap-2.5 pt-1">
					{#each socialLinks as social}
						{@const Icon = social.icon}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.name}
							class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-lime-accent hover:bg-lime-accent hover:text-ink-primary"
						>
							<span class="scale-75">
								<Icon fill="currentColor" />
							</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- Navigation Columns -->
			{#each navColumns as col}
				<div class="space-y-4 md:col-span-2">
					<h4 class="font-cabinet text-xs font-bold tracking-wider text-white/40 uppercase">
						{col.title}
					</h4>
					<ul class="space-y-2.5">
						{#each col.links as link}
							<li>
								<a
									href={link.href}
									onclick={(e) => handleNavClick(e, link.id)}
									class="text-sm text-white/70 transition-colors hover:text-lime-accent"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}

			<!-- Direct Contact -->
			<div class="space-y-4 md:col-span-3">
				<h4 class="font-cabinet text-xs font-bold tracking-wider text-white/40 uppercase">
					Direct Contact
				</h4>
				<div class="space-y-2.5 text-sm text-white/70">
					<a
						href="mailto:contact@nivabit.com"
						class="block transition-colors hover:text-lime-accent"
					>
						contact@nivabit.com
					</a>
					<a href="tel:+2349066809821" class="block transition-colors hover:text-lime-accent">
						+234 906 680 9821
					</a>
					<div class="pt-2">
						<a
							href="https://calendly.com/groupnivabit/30min"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-full bg-lime-accent px-4 py-2 text-xs font-bold text-ink-primary transition-colors hover:bg-lime-accent-hover"
						>
							Book a 30-Min Call
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Legal Bar -->
		<div
			class="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-white/40 sm:flex-row"
		>
			<p>© {new Date().getFullYear()} Nivabit. All rights reserved.</p>
			<div class="flex items-center gap-6">
				<a href="/privacy" class="transition-colors hover:text-white">Privacy Policy</a>
				<a href="/terms" class="transition-colors hover:text-white">Terms of Service</a>
			</div>
		</div>
	</div>
</footer>
