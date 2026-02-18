<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
</script>

<svelte:head>
	<title>Terms of Service - Nivabit</title>
	<meta name="description" content="Terms of Service for Nivabit" />
</svelte:head>

<main class="min-h-screen bg-brand-blue-900 px-4 pt-32 pb-20 text-white md:px-16">
	<div class="mx-auto max-w-4xl">
		<header use:reveal class="reveal mb-12">
			<h1 class="font-cabinet mb-4 text-4xl font-bold md:text-5xl">Terms of Service</h1>
			<p class="text-lg text-gray-400">Last updated: February 18, 2025</p>
		</header>

		<div use:reveal class="reveal prose prose-invert prose-brand max-w-none space-y-10">
			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">1. Agreement to Terms</h2>
				<p class="leading-relaxed text-gray-300">
					By accessing or using the Nivabit website and services, you agree to be bound by these
					Terms of Service. If you do not agree to these terms, please do not use our website or
					services.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">2. Services</h2>
				<p class="leading-relaxed text-gray-300">
					Nivabit provides software development, web design, and digital consulting services. The
					specific scope of work for any project will be outlined in a separate agreement or
					proposal provided to the client.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">3. Intellectual Property</h2>
				<p class="leading-relaxed text-gray-300">
					Unless otherwise agreed in writing, all materials created by Nivabit during the course of
					providing services remain the intellectual property of Nivabit until full payment is
					received, at which point ownership of the final deliverables may be transferred to the
					client as specified in the service agreement.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">4. User Conduct</h2>
				<p class="leading-relaxed text-gray-300">
					Users agree not to use our website or services for any unlawful purpose or in any way that
					could damage, disable, or impair the website or interfere with any other party's use of
					the website.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">5. Limitation of Liability</h2>
				<p class="leading-relaxed text-gray-300">
					To the maximum extent permitted by law, Nivabit shall not be liable for any indirect,
					incidental, special, consequential, or punitive damages resulting from your use of our
					services or website.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">6. Governing Law</h2>
				<p class="leading-relaxed text-gray-300">
					These Terms of Service shall be governed by and construed in accordance with the laws of
					the Federal Republic of Nigeria, without regard to its conflict of law principles.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">7. Changes to Terms</h2>
				<p class="leading-relaxed text-gray-300">
					We reserve the right to modify these Terms of Service at any time. We will notify users of
					any significant changes by posting the new terms on our website. Your continued use of the
					website after such changes constitutes your acceptance of the new terms.
				</p>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold text-brand-orange-500">8. Contact Information</h2>
				<p class="leading-relaxed text-gray-300">
					If you have any questions about these Terms of Service, please contact us at
					contact@nivabit.com.
				</p>
			</section>
		</div>
	</div>
</main>

<style>
	:global(.prose h2) {
		margin-top: 2rem;
	}
</style>
