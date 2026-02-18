<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
</script>

<svelte:head>
	<title>Privacy Policy - Nivabit</title>
	<meta name="description" content="Privacy Policy for Nivabit" />
</svelte:head>

<main class="min-h-screen bg-brand-blue-900 px-4 pt-32 pb-20 text-white md:px-16">
	<div class="mx-auto max-w-4xl">
		<header use:reveal class="reveal mb-12">
			<h1 class="font-cabinet mb-4 text-4xl font-bold md:text-5xl">Privacy Policy</h1>
			<p class="text-lg text-gray-400">Last updated: February 18, 2025</p>
		</header>

		<div use:reveal class="reveal prose prose-invert prose-brand max-w-none space-y-10">
			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">1. Introduction</h2>
				<p class="leading-relaxed text-gray-300">
					At Nivabit ("we," "our," or "us"), we value your privacy and are committed to protecting
					your personal data. This Privacy Policy explains how we collect, use, and safeguard your
					information when you visit our website or use our services.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">2. Information We Collect</h2>
				<p class="leading-relaxed text-gray-300">
					We may collect personal information that you provide directly to us, such as:
				</p>
				<ul class="mt-4 list-disc space-y-2 pl-6 text-gray-300">
					<li>Contact information (e.g., name, email address, phone number).</li>
					<li>Business information (e.g., company name, project requirements).</li>
					<li>
						Any other information you choose to provide through our contact forms or during
						consultations.
					</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">
					3. How We Use Your Information
				</h2>
				<p class="leading-relaxed text-gray-300">We use the information we collect to:</p>
				<ul class="mt-4 list-disc space-y-2 pl-6 text-gray-300">
					<li>Provide, maintain, and improve our services.</li>
					<li>Respond to your inquiries and provide customer support.</li>
					<li>Send you technical notices, updates, and administrative messages.</li>
					<li>Communicate with you about products, services, offers, and events.</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">4. Data Security</h2>
				<p class="leading-relaxed text-gray-300">
					We implement appropriate technical and organizational measures to protect your personal
					information against unauthorized access, loss, or alteration. However, no method of
					transmission over the internet or electronic storage is 100% secure.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">5. Cookies and Tracking</h2>
				<p class="leading-relaxed text-gray-300">
					Our website may use cookies and similar tracking technologies to enhance your experience
					and analyze website traffic. You can control cookie preferences through your browser
					settings.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">6. Third-Party Links</h2>
				<p class="leading-relaxed text-gray-300">
					Our website may contain links to third-party sites. We are not responsible for the privacy
					practices or content of those websites. We encourage you to read their privacy policies.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">7. Contact Us</h2>
				<p class="leading-relaxed text-gray-300">
					If you have any questions or concerns about this Privacy Policy, please contact us at:
				</p>
				<div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
					<p class="font-bold text-white">Nivabit Group</p>
					<p class="text-gray-300">Email: contact@nivabit.com</p>
					<p class="text-gray-300">Phone: +2349066809821</p>
				</div>
			</section>
		</div>
	</div>
</main>

<style>
	:global(.prose h2) {
		margin-top: 2rem;
	}
</style>
