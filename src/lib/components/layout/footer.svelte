<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import Button from '../ui/button/button.svelte';
	import IconButton from '$lib/components/customUI/button/iconButton.svelte';
	import Twitter from '../icon/twitter.svelte';
	import Facebook from '../icon/facebook.svelte';
	import Linkedin from '../icon/linkedin.svelte';
	import Message from '../icon/message.svelte';
	import Call from '../icon/call.svelte';
	import CustomButton from '$lib/components/customUI/button/customButton.svelte';
	import { Instagram, InstagramIcon } from 'lucide-svelte';
	import { IconBrandTiktok } from '@tabler/icons-svelte';

	let iconFills: Record<string, string> = $state({
		twitter: '#ffffff',
		facebook: '#ffffff',
		linkedin: '#ffffff',
		message: '#ffffff',
		call: '#ffffff'
	});

	const contactDetails = [
		{
			name: 'message',
			title: 'contact@nivabit.com',
			icon: Message,
			url: ''
		},
		{
			name: 'call',
			title: '+2349071133025',
			icon: Call,
			url: 'https://www.facebook.com/search/top?q=nivabit'
		}
	];

	const socialLinks = [
		{
			name: 'twitter',
			icon: Twitter,
			url: '@groupnivabit'
		},
		{
			name: 'facebook',
			icon: Facebook,
			url: 'https://www.facebook.com/search/top?q=nivabit'
		},
		{
			name: 'linkedin',
			icon: Linkedin,
			url: 'https://www.linkedin.com/company/104662763/admin/dashboard/'
		}
		// {
		//   name:'instagram',
		//   icon: InstagramIcon,
		//   url: "https://www.instagram.com/groupnivabit/"
		// },
		// {
		//   name:'Tiktok',
		//   icon: IconBrandTiktok,
		//   url: "https://www.tiktok.com/@nivabit"
		// }
	];
	const quickLinks = ['Home', 'Services', 'About us', 'Contact us'];

	// Smooth scroll to section
	const scrollToSection = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const handleNavClick = async (sectionId: string) => {
		const currentPath = get(page).url.pathname;

		if (currentPath === '/') {
			scrollToSection(sectionId);
		} else {
			// Navigate to home with query param
			goto(`/#${sectionId}`);
		}
	};

	// Run scroll if redirected to home with ?section=xyz
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const sectionId = urlParams.get('section');

		if (sectionId) {
			// Wait a little for layout to be ready
			setTimeout(() => {
				scrollToSection(sectionId);
			}, 200);
		}
	});
</script>

<footer class="border-t border-brand-blue-400 bg-brand-blue-900">
	<!-- Main Footer -->
	<div class="px-4 py-16 md:px-16 md:py-24">
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-4">
			<!-- Logo & Description -->
			<div use:reveal class="reveal space-y-8 lg:col-span-2">
				<img src="/images/nivabit.png" alt="Nivabit Logo" class="h-7 w-auto" />
				<p class="max-w-sm text-sm leading-relaxed text-brand-grey-50">
					Ready to take the next step? Have questions about our services? We're here to help. Let's
					start building something incredible together.
				</p>

				<!-- Social Links -->
				<div class="flex gap-5">
					{#each socialLinks as social}
						<IconButton
							class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange-500"
							onmouseenter={() => (iconFills[social.name] = '#00042B')}
							onmouseleave={() => (iconFills[social.name] = '#ffffff')}
						>
							{@const Component = social.icon}
							<Component fill={iconFills[social.name]} />
						</IconButton>
					{/each}
				</div>
			</div>

			<!-- Quick Links -->
			<div use:reveal class="reveal space-y-4">
				<h4 class="text-lg font-medium text-white">Quick Links</h4>
				<nav class="space-y-3">
					{#each quickLinks as link}
						<CustomButton className="" href="/">
							{link}
						</CustomButton>
					{/each}
				</nav>
			</div>

			<!-- Contact Info -->
			<div use:reveal class="reveal space-y-4">
				<h4 class="text-lg font-medium text-white">Contact us</h4>
				<p class="text-sm leading-relaxed text-brand-grey-50">
					Ready to take the next step? Have questions about our services? We're here to help. Let's
					start building something incredible together.
				</p>

				<div class="space-y-3">
					<!-- Email -->
					{#each contactDetails as contact}
						<div class="flex items-center gap-3">
							<IconButton
								class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange-500"
								onmouseenter={() => (iconFills[contact.name] = '#00042B')}
								onmouseleave={() => (iconFills[contact.name] = '#ffffff')}
							>
								{@const Component = contact.icon}
								<Component fill={iconFills[contact.name]} />
							</IconButton>
							<span class="text-sm text-brand-grey-50">{contact.title}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Footer Bottom -->
	<div use:reveal class="reveal border-t border-brand-blue-400 px-4 py-8 md:px-16">
		<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
			<p class="text-sm text-white">© Nivabit 2025. All rights reserved</p>

			<div class="flex gap-8">
				<CustomButton className="">Privacy Policy</CustomButton>
				<CustomButton className="">Terms of Service</CustomButton>
			</div>
		</div>
	</div>
</footer>
