<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import MainButton from '$lib/components/customUI/button/MainButton.svelte';
	import ContactUs from '$lib/components/layout/contactUs.svelte';
	import { onMount } from 'svelte';
	import CircularText from '$lib/components/layout/circularText.svelte';

	// Reuse existing project data for portfolio
	const projects = [
		{
			title: 'Facity',
			duration: '12 weeks',
			type: 'Web/Mobile App',
			category: 'Fintech',
			image: '/images/project/Project-7.png'
		},
		{
			title: 'Tichly',
			duration: '12 weeks',
			type: 'WebApp',
			category: 'E-learning',
			image: '/images/project/Project-6.png'
		},
		{
			title: 'Broglux',
			duration: '4 weeks',
			type: 'Website',
			category: 'Ecommerce',
			image: '/images/project/Project-8.png'
		}
	];

	// Reuse testimonials
	const testimonials = [
		{
			message: `Nivabit didn't just build a website; they engineered our entire learning management system. The adaptive streaming technology they implemented has been a game-changer for our students across Africa.`,
			name: 'Allen Zito',
			role: 'Co-Founder, Tichly',
			image: '/images/profile3.jpg'
		},
		{
			message: `We needed a platform that screamed 'premium' to match our luxury inventory. Nivabit delivered a stunning, high-performance ecommerce experience that has significantly boosted our brand perception and sales.`,
			name: 'Eniola Awotunde',
			role: 'CEO, Broglux',
			image: '/images/profile2.jpg'
		},
		{
			message: `A team of passionate innovators dedicated to bringing your digital dreams to life. With years of experience and a commitment to excellence.`,
			name: 'Owonikoko Olaoluwa',
			role: 'CEO, Nivabit',
			image: '/images/profile1.png'
		}
	];

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	function openWhatsApp() {
		// Obfuscated number to prevent crawling
		const part1 = '234';
		const part2 = '906';
		const part3 = '680';
		const part4 = '9821';
		const number = `${part1}${part2}${part3}${part4}`;
		const text = encodeURIComponent("Hello, I'm interested in building a high-converting website.");
		window.open(`https://wa.me/${number}?text=${text}`, '_blank');
	}
</script>

<svelte:head>
	<title>Nivabit - Professional Software Development Company in Nigeria</title>
	<meta
		name="description"
		content="Get a high-converting website that turns visitors into revenue. Mobile-friendly, fast, and professional web design services for high-growth businesses."
	/>

	<!-- Facebook Pixel Code -->
	<script>
		!(function (f, b, e, v, n, t, s) {
			if (f.fbq) return;
			n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
			};
			if (!f._fbq) f._fbq = n;
			n.push = n;
			n.loaded = !0;
			n.version = '2.0';
			n.queue = [];
			t = b.createElement(e);
			t.async = !0;
			t.src = v;
			s = b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t, s);
		})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '1952710342260113');
		fbq('track', 'PageView');
	</script>
	<noscript>
		<img
			height="1"
			width="1"
			src="https://www.facebook.com/tr?id=1952710342260113&ev=PageView
&noscript=1"
			alt="pixel"
		/>
	</noscript>
	<!-- End Facebook Pixel Code -->
</svelte:head>

<main class="min-h-screen bg-brand-blue-900 text-white">
	<!-- Hero Section -->
	<section class="relative overflow-hidden px-4 pt-24 pb-16 md:px-16 md:pt-40 md:pb-24">
		<div class="mx-auto max-w-7xl">
			<div class="flex flex-col items-center gap-12 lg:flex-row lg:gap-24">
				<div class="z-10 flex-1 space-y-8">
					<div
						class="inline-block rounded-full border border-brand-orange-500/30 bg-brand-orange-500/20 px-4 py-1.5"
					>
						<span class="text-sm font-medium tracking-wide text-brand-orange-500"
							>TRUSTED BY HIGH-GROWTH BUSINESSES</span
						>
					</div>

					<h1 class="font-cabinet text-4xl leading-tight font-bold md:text-5xl lg:text-7xl">
						<span use:revealWords class="reveal-words block">Stop Leaving Money</span>
						<span use:revealWords class="reveal-words block text-brand-orange-500"
							>On The Table.</span
						>
						<span use:revealWords class="reveal-words block">Turn Visitors Into Revenue.</span>
					</h1>

					<p use:reveal class="reveal font-synonym max-w-2xl text-xl leading-relaxed text-gray-300">
						We build high-performance digital experiences designed to convert traffic into sales.
						Fast, mobile-first, and engineered for growth—no matter where your customers are.
					</p>

					<div use:reveal class="reveal flex flex-col gap-4 pt-4 sm:flex-row">
						<MainButton
							href="#contact"
							class="flex items-center justify-center gap-2 rounded-full bg-brand-orange-500 px-8 py-4 font-medium text-white transition-transform hover:scale-105 hover:bg-brand-orange-600"
						>
							Get A Free Quote
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="ml-1">
								<path
									d="M5 12H19M19 12L12 5M19 12L12 19"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</MainButton>

						<button
							onclick={openWhatsApp}
							class="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-600 bg-transparent px-8 py-4 text-white transition-colors hover:bg-white/10"
						>
							<span>Chat on WhatsApp</span>
						</button>
					</div>
				</div>

				<!-- Circular Text Element (Hidden on mobile for cleaner look) -->

				<div use:reveal class="reveal relative z-20 hidden shrink-0 lg:block">
					<a
						href="/landing/#contact"
						class="group relative flex h-48 w-48 items-center justify-center"
					>
						<div
							class="absolute inset-0 rounded-full bg-brand-blue-900/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-orange-500/20"
						></div>
						<div class="relative transition-transform duration-500 group-hover:scale-110">
							<CircularText />
						</div>
					</a>
				</div>
			</div>
		</div>

		<!-- Background Elements -->
		<div class="absolute inset-0 z-0 opacity-40">
			<img src="/images/hero_bg.png" alt="" class="h-full w-full object-cover" />
			<div class="absolute inset-0 bg-brand-blue-900/40 mix-blend-multiply"></div>
			<div
				class="absolute inset-0 bg-gradient-to-b from-brand-blue-900/80 via-brand-blue-900/60 to-brand-blue-900"
			></div>
		</div>
	</section>

	<!-- Problem & Solution Section -->
	<section
		class="relative z-20 -mt-10 rounded-t-[3rem] bg-white px-4 py-6 text-brand-blue-900 md:px-16 md:py-20"
	>
		<div class="mx-auto max-w-7xl">
			<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
				<div use:reveal class="reveal space-y-6">
					<h2 class="font-cabinet mb-6 text-3xl font-bold md:text-4xl">
						Is Your Business <span class="text-red-500">Truly Visible?</span>
					</h2>
					<p class="text-lg leading-relaxed text-gray-600">
						In today's digital-first world, simply "having a website" isn't enough. If your site
						doesn't load fast and convert, you're losing money every second.
					</p>
					<ul class="mt-6 space-y-4">
						<li class="flex items-start gap-3">
							<div class="mt-1 min-w-[24px] text-red-500">✕</div>
							<p class="text-gray-700">
								Competitors with superior digital experiences are winning your clients.
							</p>
						</li>
						<li class="flex items-start gap-3">
							<div class="mt-1 min-w-[24px] text-red-500">✕</div>
							<p class="text-gray-700">Customers can't find you when they need you most.</p>
						</li>
						<li class="flex items-start gap-3">
							<div class="mt-1 min-w-[24px] text-red-500">✕</div>
							<p class="text-gray-700">
								Poor design is silently damaging your brand's credibility.
							</p>
						</li>
					</ul>
				</div>

				<div
					use:reveal
					class="reveal rounded-3xl border border-brand-blue-800 bg-brand-blue-900 p-8 shadow-xl md:p-10"
				>
					<h3 class="font-cabinet mb-4 text-2xl font-bold text-white">The Growth Engine</h3>
					<p class="mb-8 text-blue-100">
						We don't just build websites; we build high-converting sales channels. Our solutions
						combine stunning design with psychology-driven strategy to maximize your ROI.
					</p>

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div class="rounded-xl bg-white p-5 shadow-sm">
							<div
								class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange-100 text-brand-orange-500"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg
								>
							</div>
							<h4 class="text-lg font-bold text-gray-900">Lightning Fast</h4>
							<p class="text-sm text-gray-500">Optimized for conversion.</p>
						</div>
						<div class="rounded-xl bg-white p-5 shadow-sm">
							<div
								class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-100 text-brand-blue-500"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path
										d="M12 18h.01"
									></path></svg
								>
							</div>
							<h4 class="text-lg font-bold text-gray-900">Mobile Perfect</h4>
							<p class="text-sm text-gray-500">Flawless on every screen.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Portfolio Preview -->
	<section class="bg-brand-blue-50 px-4 py-20 md:px-16">
		<div class="mx-auto max-w-7xl">
			<div class="mb-16 text-center">
				<span class="text-sm font-medium tracking-wide text-brand-orange-500 uppercase"
					>Our Work</span
				>
				<h2 class="font-cabinet mt-3 text-3xl font-bold text-brand-blue-900 md:text-5xl">
					Recent Projects
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each projects as project}
					<div
						use:reveal
						class="reveal group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md"
					>
						<div class="h-56 overflow-hidden">
							<img
								src={project.image}
								alt={project.title}
								class="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div class="p-6">
							<div class="mb-2 flex items-start justify-between">
								<h3 class="text-xl font-bold text-gray-900">{project.title}</h3>
								<span
									class="rounded-full bg-brand-blue-100 px-3 py-1 text-xs font-medium text-brand-blue-600"
									>{project.category}</span
								>
							</div>
							<p class="text-sm text-gray-500">{project.type}</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-12 text-center">
				<a
					href="/#portfolio"
					class="inline-flex items-center gap-2 font-medium text-brand-orange-500 hover:text-brand-orange-600"
				>
					View All Projects
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg
					>
				</a>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="bg-white px-4 py-20 md:px-16">
		<div class="mx-auto max-w-7xl text-center">
			<h2 class="font-cabinet mb-12 text-3xl font-bold text-brand-blue-900 md:text-4xl">
				What Our Clients Say
			</h2>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each testimonials as testimonial}
					<div use:reveal class="reveal rounded-2xl bg-brand-blue-50 p-8 text-left">
						<div class="mb-6 flex items-center gap-4">
							<img
								src={testimonial.image}
								alt={testimonial.name}
								class="h-12 w-12 rounded-full object-cover"
							/>
							<div>
								<h4 class="font-bold text-gray-900">{testimonial.name}</h4>
								<p class="text-sm text-gray-500">{testimonial.role}</p>
							</div>
						</div>
						<p class="leading-relaxed text-gray-700">"{testimonial.message}"</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact / CTA Section -->
	<!-- Reusing the ContactUs component which handles form submission logic -->
	<div class="border-t border-brand-blue-900">
		<ContactUs />
	</div>
</main>

<style>
	/* Add any page-specific styles here if needed, most is handled by Tailwind */
</style>
