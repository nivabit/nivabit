<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import MainButton from '$lib/components/customUI/button/MainButton.svelte';
	import ContactUs from '$lib/components/layout/contactUs.svelte';
	import Hero from '$lib/components/layout/Hero.svelte';
	import Newsletter from '$lib/components/layout/newsletter.svelte';
	import Process from '$lib/components/layout/process.svelte';
	import Resources from '$lib/components/layout/resources.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Motion from 'motion-svelte';
	import { onMount } from 'svelte';

	// Image IDs for scrolling section
	const imageIds = [
		'/images/project/Project-1.png',
		'/images/project/Project-3.png',
		'/images/project/Project-4.png',
		'/images/project/Project-5.png',
		'/images/project/Project-2.png',
	];

	const companyLogo = [
		'/images/clients/1.png',
		'/images/clients/2.png',
		'/images/clients/3.png',
		'/images/clients/4.png',
		'/images/clients/5.png',
		'/images/clients/6.png',
	];

	const services = [
		{
			number: '01',
			title: 'Product Design',
			services: ['Saas Platform', 'Web Platform', 'Mobile App'],
			desc: 'We transform ideas into intuitive, high-performing products users love. Through strategic UX/UI design, we create seamless digital experiences that drive engagement, retention, and business growth.'
		},
		{
			number: '02',
			title: 'Brand Design',
			services: ['Startup Branding', 'Rebranding', 'Brand Collateral'],
			desc: 'Your brand is your story - we help you tell it powerfully. From logos to full visual identities, we craft distinctive branding that resonates with your audience and stands out in competitive markets.'
		},
		{
			number: '03',
			title: 'Web Development',
			services: ['Business Websites', 'E-Commerce Stores', 'Web Applications'],
			desc: 'Websites that work as hard as you do. We build responsive, secure, and high-converting digital platforms optimized for performance, search visibility, and user experience across all devices.'
		},
		{
			number: '04',
			title: 'Project Research',
			services: ['Market Validation', 'User Behavior Analysis', 'Competitive Audits'],
			desc: 'Data-driven decisions start here. Our comprehensive market and user research provides the insights you need to validate concepts, minimize risks, and position your project for maximum impact.'
		},
		{
			number: '05',
			title: 'Product Development',
			services: ['Custom SaaS Development', 'ERP Integration', 'Internal Tools'],
			desc: 'Custom digital solutions that streamline your operations. We design and develop tailored software systems that automate workflows, integrate processes, and give you the competitive edge to scale efficiently.'
		}
	];

	const projects = [
		{
			title: 'Fermerce',
			duration: '6 weeks',
			type: 'Website',
			category: 'Ecommerce',
			image: '/images/project/Project-1.png'
		},
		{
			title: 'Padetunes',
			duration: '8 weeks',
			type: 'WebApp',
			category: 'Music',
			image: '/images/project/Project-4.png'
		},
		{
			title: "Mr. Olusola's Website",
			duration: '4 weeks',
			type: 'Website',
			category: 'Personal',
			image: '/images/project/Project-3.png'
		}
	];

	let testimonials = [
		{
			message: `A team of passionate innovators dedicated to bringing your digital dreams to life. With years of experience and a commitment to excellence. We collaborate closely with our clients to deliver impactful solutions that drive success.`,
			name: 'Owonikoko Olaoluwa',
			role: 'CEO, Nivabit',
			image: '/images/profile1.png'
		},
		{
			message: `Nivabit transformed our vision into a stunning product. Their process was transparent, efficient, and always client-first.`,
			name: 'Grace Adebayo',
			role: 'Founder, Grace Inc.',
			image: '/images/profile2.jpg'
		},
		{
			message: `They’re not just developers – they’re strategic partners who care deeply about results. We saw a 40% increase in user engagement.`,
			name: 'Chuka Obi',
			role: 'CTO, Finlit Africa',
			image: '/images/profile3.jpg'
		}
	];

	let current = $state(0);
	let direction = $state(1);
	let mounted = $state(false);
	let activeServiceIndex: number | null = $state(null);

	function toggleService(index: number) {
		activeServiceIndex = activeServiceIndex === index ? null : index;
	}

	function next() {
		direction = 1;
		current = (current + 1) % testimonials.length;
	}

	function prev() {
		direction = -1;
		current = (current - 1 + testimonials.length) % testimonials.length;
	}

	onMount(() => {
		mounted = true;
	});
</script>

<main>
	<Hero />
	<!-- Horizontal Project Showcase -->
	<section class="bg-brand-blue-900 py-8 md:py-12">
		<div use:reveal class="reveal relative overflow-hidden">
			<div class="marquee flex w-max animate-marquee space-x-5">
				{#each imageIds.concat(imageIds) as img, i}
					<div class="shrink-0">
						<img
							src={img}
							alt={`Project ${i + 1}`}
							class="h-64 w-64 rounded-2xl object-cover md:h-80 md:w-80"
						/>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- {/* Trusted By Section */} -->
	<section class="bg-brand-blue-900 px-4 pb-16 md:px-16 md:pb-24 pt-16 md:pt-0">
		<div class="mx-auto max-w-7xl overflow-hidden text-center">
			<p class="mb-10 text-lg ">
				<span use:revealWords class="reveal-words text-white font-synonym">Trusted by </span>
				<span use:revealWords class="reveal-words text-brand-orange-500 font-synonym">visionaries</span>
			</p>

			<div
				use:reveal
				class="reveal relative overflow-hidden"
			>
				<div class="marquee flex w-full animate-marquee space-x-8 opacity-50 md:space-x-16">
					{#each companyLogo.concat(companyLogo) as img, i}
						<div class="shrink-0">
							<img
								src={img}
								alt="Company Logo"
								class="h-10 w-auto opacity-75 transition-opacity hover:opacity-100 object-cover"
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- {/* About Us Section */} -->
	<section id="about" class="bg-bg-orange px-4 py-16 md:px-16 md:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="flex flex-col items-end gap-[10px] sm:gap-12 lg:flex-row lg:gap-24">
				<div use:reveal class="reveal w-full shrink-0 self-start lg:w-96">
					<p class="text-lg text-brand-grey-500">About us</p>
				</div>

				<div class="flex-1">
					<div class="space-y-10">
						<h2 use:revealWords class="reveal-words text-[32px] text-brand-grey-500 md:text-[42px]">
							A team of passionate innovators dedicated to bringing your digital dreams to life.
							With years of experience and a commitment to excellence. We collaborate closely with
							our clients to deliver impactful solutions that drive success.
						</h2>

						<div use:reveal class="reveal text-center">
							<MainButton
								href="#contact"
								class="flex items-center gap-2 rounded-full bg-brand-orange-500 text-sm text-white transition-colors hover:bg-brand-orange-500/90"
							>
								Get Started
								<svg width="16" height="16" viewBox="0 0 16 17" fill="none">
									<path
										d="M2.66602 8.03777V9.3711H10.666L6.99935 13.0378L7.94602 13.9844L13.226 8.70444L7.94602 3.42444L6.99935 4.37111L10.666 8.03777H2.66602Z"
										fill="white"
									/>
								</svg>
							</MainButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- {/* Services Section */} -->
	<section id="services" class="bg-bg-orange py-16 md:py-24">
		<div class="mx-auto">
			<!-- Services Header -->
			<div class="mb-16 flex flex-col gap-12 lg:flex-row lg:gap-24 px-4 md:px-16">
				<div use:reveal class="reveal w-full shrink-0 lg:w-96">
					<p class="text-lg text-brand-grey-500">Services</p>
				</div>

				<div class="flex-1">
					<h2
						use:revealWords
						class="reveal-words text-3xl leading-[1.3] text-brand-grey-500 md:text-4xl lg:text-5xl"
					>
						We offer a range of digital solutions tailored to your business needs.
					</h2>
				</div>
			</div>

			<!-- Services List -->
			<div class="space-y-0">
				{#each services as service, index}
					<button
						type="button"
						use:reveal
						class="reveal group hover:bg-[#FFF3E7] cursor-pointer flex w-full flex-col gap-8 border-b border-brand-blue-100 py-12 text-start md:py-16 lg:flex-row lg:gap-24 transition-opacity duration-300 ease-in-out"
						onclick={() => toggleService(index)}
					>
						<div class="flex w-full flex-col gap-10 lg:flex-row lg:gap-24 px-4 md:px-16">
							<div class="w-full shrink-0 lg:w-96">
								<p class="text-lg text-brand-grey-500">{service.number}</p>
							</div>

							<div class="flex-1 space-y-10">
								<h3 class="text-2xl font-bold text-brand-grey-500 md:text-3xl">
									{service.title}
								</h3>

								<div class="flex flex-wrap items-center gap-3">
									{#each service.services as item}
										<div class="flex items-center gap-3">
											<div class="h-1.5 w-1.5 rounded-full bg-brand-orange-500"></div>
											<span class="text-lg text-brand-grey-500">{item}</span>
										</div>
									{/each}
								</div>

								
								<div class="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-96" class:max-h-96={activeServiceIndex === index}>
									<p class="mb-8 text-lg font-normal text-brand-grey-500 md:text-2xl">
										{service.desc}
									</p>
									<Button href="#contact" class="flex items-center gap-2 rounded-full border border-brand-blue-700 bg-transparent text-sm hover:bg-brand-blue-700 hover:text-white group relative py-7 h-auto w-48 overflow-hidden transition-all duration-300 ease-in-out cursor-pointer">
										<!-- Top Layer (default state) -->
										<div
											class='absolute inset-0 z-10 flex items-center justify-center text-brand-blue-700 transition-transform duration-300 ease-in-out group-hover:-translate-y-full'
										>
											Get Started
											<svg width="16" height="16" viewBox="0 0 16 17" fill="none">
												<path
													d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z"
													fill="#00042B"
												/>
											</svg>
										</div>

										<!-- Bottom Layer (hover state) -->
										<div
											class='absolute inset-0 z-0 flex translate-y-full items-center justify-center bg-brand-blue-900 text-white transition-transform duration-300 ease-in-out group-hover:translate-y-0 gap-4'
										>
											Get Started
											<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M2.66602 7.8333V9.16664H10.666L6.99935 12.8333L7.94602 13.78L13.226 8.49997L7.94602 3.21997L6.99935 4.16664L10.666 7.8333H2.66602Z" fill="white"/>
											</svg>												
										</div>
									</Button>
								</div>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</section>

	<!-- {/* Portfolio Section */} -->
	<section id="portfolio" class="bg-bg-blue px-4 py-16 md:px-16 md:py-24">
		<div class="mx-auto max-w-7xl">
			<!-- Portfolio Header -->
			<div class="mb-16 flex flex-col items-end gap-12 lg:flex-row lg:gap-24">
				<div use:reveal class="reveal w-full shrink-0 self-start lg:w-96">
					<p class="text-lg text-brand-grey-500">Portfolio</p>
				</div>

				<div class="flex-1 space-y-10">
					<!-- Project Grid -->
					<div class="mb-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
						{#each projects as project}
							<div
								use:reveal
								class="reveal group space-y-10 rounded-2xl border border-brand-blue-100 bg-brand-blue-50 p-5 hover:border-brand-blue-500"
							>
								<div class="space-y-5">
									<h3 class="text-center text-2xl text-brand-grey-500">
										{project.title}
									</h3>

									<div class="flex flex-wrap items-center justify-center gap-2">
										<span
											class="rounded-full bg-bg-blue px-5 py-2 text-sm text-brand-blue-500 transition-colors duration-300 ease-in-out group-hover:bg-brand-blue-700 group-hover:text-white"
										>
											{project.duration}
										</span>

										<span
											class="rounded-full bg-bg-blue px-5 py-2 text-sm text-brand-blue-500 transition-colors duration-300 ease-in-out group-hover:bg-brand-blue-700 group-hover:text-white"
										>
											{project.type}
										</span>

										<span
											class="rounded-full bg-bg-blue px-5 py-2 text-sm text-brand-blue-500 transition-colors duration-300 ease-in-out group-hover:bg-brand-blue-700 group-hover:text-white"
										>
											{project.category}
										</span>
									</div>
								</div>

								<div class="relative h-60 w-full overflow-hidden rounded-lg">
									<img
										src={project.image}
										alt={project.title}
										class="h-full w-full transform rounded-lg object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
									/>
								</div>
							</div>
						{/each}
					</div>

					<!-- CTA Button -->
					<div use:reveal class="reveal text-center">
						<MainButton
							href="#contact"
							class="flex items-center gap-2 rounded-full bg-brand-orange-500 text-sm text-white  transition-colors hover:bg-brand-orange-500/90"
						>
							Get Started
							<svg width="16" height="16" viewBox="0 0 16 17" fill="none">
								<path
									d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z"
									fill="white"
								/>
							</svg>
						</MainButton>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- {/* Process Section */} -->
	<Process />
	<!-- {/* Resources Section */} -->
	<Resources />
	<Newsletter />
	<ContactUs />
</main>

<style>
	.next-section {
		margin-top: -0vh; /* Overlap the last step */
		z-index: 10;
		position: relative;
		background: white;
	}
</style>