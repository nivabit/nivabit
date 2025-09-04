<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import Input from '../ui/input/input.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import { z } from 'zod';
	import { toast } from 'svelte-sonner';
	import { sendContactForm } from '$lib/mail_sender';
	import MainButton from '../customUI/button/MainButton.svelte';

	let selectedService = $state('');
	const services = ['Design', 'Development', 'Research', 'Others'];

	function selectService(service: string) {
		selectedService = service;
	}

	const ContactSchema = z.object({
		name: z.string().min(2, {
			message: 'First name must be at least 2 characters.'
		}),
		email: z.string({ message: 'Company email is required' }).email(),
		message: z.string().min(5, 'Message must be at least 5 characters.')
	});

	let name = $state('');
	let email = $state('');
	let message = $state('');

	let errors: Record<string, string> = $state({});
	let isSubmitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errors = {}; // reset

		const result = ContactSchema.safeParse({
			name,
			email,
			message
		});

		if (!result.success) {
			// collect zod errors
			for (const err of result.error.issues) {
				errors[err.path[0] as string] = err.message;
			}
			return;
		}

		isSubmitting = true;

		try {
			// simulate sending form (replace with your API call e.g. sendContactForm)
			const res = await sendContactForm({
				services: selectedService,
				...result.data,
				subject: 'Lead from contact'
			});

			if (res.ok) {
				toast.success('Message was sent successfully', {
					description: 'Thanks for contacting us, our team will reach out soon.'
				});

				// reset form
				name = '';
				email = '';
				message = '';
				selectedService = 'Design';
			} else {
				toast.error('Something went wrong. Please try again.');
			}
		} catch (err) {
			toast.error('Something went wrong. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class="bg-brand-blue-900 px-4 py-16 md:px-16 md:py-24">
	<div class="mx-auto max-w-7xl">
		<div class="flex flex-col items-end gap-12 lg:flex-row lg:gap-24">
			<div use:reveal class="reveal w-full flex-shrink-0 self-start lg:w-96">
				<p class="text-lg text-white">Contact us</p>
			</div>

			<div class="flex-1 space-y-16">
				<h2
					use:revealWords
					class="reveal-words font-cabinet text-2xl font-medium text-white md:text-3xl"
				>
					Tell us about your project
				</h2>

				<form class="space-y-10" onsubmit={handleSubmit}>
					<!-- Service Selection -->
					<div use:reveal class="reveal">
						<label for="" class="mb-3 block text-lg text-white">Choose service</label>
						<div class="flex flex-wrap gap-5">
							{#each services as service}
								<button
									type="button"
									class={`flip-button relative flex flex-col items-center justify-center overflow-hidden rounded-full border px-5 py-3 text-sm transition-colors ${
										selectedService === service
											? 'border-bg-blue bg-white text-brand-blue-500'
											: 'border-brand-blue-50 text-brand-blue-100'
									}`}
									onclick={() => selectService(service)}
								>
									<span class={`${selectedService === service ? '' : 'slide-text'}`}>
										<span
											class={`${selectedService === service ? '' : 'text-top text-brand-blue-100'}`}
											>{service}</span
										>
										<span class="text-bottom text-white">{service}</span>
									</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Name and Email -->
					<div use:reveal class="reveal">
						<label for="name" class="mb-3 block text-lg text-white">Name</label>
						<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
							<Input
								type="text"
								placeholder="John Doe"
								bind:value={name}
								name="name"
								id="name"
								class="rounded-full border border-bg-blue bg-transparent px-5 py-7 text-brand-grey-200  placeholder:text-brand-grey-200 focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
							/>
							{#if errors.name}<p class="block text-sm text-red-500 md:hidden">
									{errors.name}
								</p>{/if}
							<div>
								<label for="name" class="mb-3 block text-lg text-white md:hidden">Email</label>
								<Input
									type="email"
									placeholder="Email"
									bind:value={email}
									name="email"
									id="email"
									class="rounded-full border border-bg-blue bg-transparent px-5 py-7 text-brand-grey-200  placeholder:text-brand-grey-200 focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
								/>
							</div>
							{#if errors.name}<p class="hidden text-sm text-red-500 md:block">
									{errors.name}
								</p>{/if}
							{#if errors.email}<p class="text-sm text-red-500">{errors.email}</p>{/if}
						</div>
					</div>

					<!-- Message -->
					<div use:reveal class="reveal">
						<label for="message" class="mb-3 block text-lg text-white">Message</label>
						<Textarea
							rows={6}
							placeholder="Your Message"
							bind:value={message}
							name="message"
							id="message"
							class="w-full resize-none rounded-2xl border border-bg-blue bg-transparent px-5 py-5  text-brand-grey-200 placeholder:text-brand-grey-200 focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
						></Textarea>
						{#if errors.message}<p class="mt-5 text-sm text-red-500">{errors.message}</p>{/if}
					</div>

					<!-- Submit Button -->
					<div use:reveal class="reveal">
						<MainButton
							disabled={isSubmitting}
							type="submit"
							class="flex items-center gap-2 rounded-full bg-brand-orange-500 px-5 py-3 text-sm text-white  transition-colors hover:bg-brand-orange-500/90"
						>
							{isSubmitting ? 'Submitting...' : 'Submit'}
							<svg width="16" height="16" viewBox="0 0 16 17" fill="none">
								<path
									d="M2.66602 8.03814V9.37147H10.666L6.99935 13.0381L7.94602 13.9848L13.226 8.7048L7.94602 3.4248L6.99935 4.37147L10.666 8.03814H2.66602Z"
									fill="white"
								/>
							</svg>
						</MainButton>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>
