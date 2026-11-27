<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ArrowRight, Check } from 'lucide-svelte';
	import { submitContact } from '#lib/remote/contact.remote.ts';
	import { contactSchema } from '#lib/validation/validation.ts';

	let selectedServices: string[] = $state([]);
	const services = [
		'Idea Validation Sprint',
		'Customer Discovery Interviews',
		'Market Sizing & Feasibility',
		'Competitor Gap Teardown',
		'Willingness-to-Pay Testing',
		'Enterprise Research Dossier'
	];

	function toggleService(service: string) {
		if (selectedServices.includes(service)) {
			selectedServices = selectedServices.filter((s) => s !== service);
		} else {
			selectedServices = [...selectedServices, service];
		}
	}
</script>

<section id="contact" class="bg-surface-light px-4 py-20 md:px-8 md:py-28">
	<div class="mx-auto max-w-4xl">
		<div class="rounded-3xl border border-black/10 bg-surface-dark p-6 text-white shadow-xl md:p-12">
			<div class="mb-10 max-w-xl space-y-3">
				<span
					class="inline-block rounded-full border border-brand-accent/40 bg-brand-accent/15 px-3.5 py-1 text-[11px] font-bold tracking-wider text-brand-accent-light uppercase"
				>
					Start a Sprint
				</span>
				<h2
					class="font-cabinet text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-white sm:text-4xl"
				>
					Scope your validation sprint.
				</h2>
				<p class="text-sm leading-relaxed text-white/65">
					Select the research modules you need and tell us about your hypothesis. We’ll reply within
					24 hours with a tailored validation scope and timeline matched to your project’s size.
				</p>
			</div>

			<form
				class="space-y-7"
				{...submitContact.preflight(contactSchema).enhance(async ({ form, submit }) => {
					const ok = await submit();
					if (!ok) {
						const rootIssue = submitContact.fields.allIssues()?.find((i) => !i.path?.length);
						if (rootIssue) toast.error(rootIssue.message);
						return;
					}
					toast.success('Sprint inquiry sent', {
						description: 'Thanks for reaching out. Our research team will reply within 24 hours.'
					});
					form.reset();
					selectedServices = [];
				})}
				oninput={() => submitContact.validate()}
			>
				<input {...submitContact.fields.services.as('hidden', selectedServices.join(', '))} />
				<input {...submitContact.fields.subject.as('hidden', 'Lead from contact')} />

				<!-- Service Selection Pills -->
				<div>
					<p class="mb-3 text-xs font-bold tracking-wider text-white/50 uppercase">
						Select Validation Modules
					</p>
					<div class="flex flex-wrap gap-2.5">
						{#each services as service}
							{@const active = selectedServices.includes(service)}
							<button
								type="button"
								onclick={() => toggleService(service)}
								class={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
									active
										? 'border-brand-accent bg-brand-accent text-white'
										: 'border-white/15 bg-white/[0.04] text-white/80 hover:border-white/35 hover:bg-white/[0.08]'
								}`}
							>
								{#if active}
									<Check size={13} strokeWidth={3} />
								{/if}
								{service}
							</button>
						{/each}
					</div>
				</div>

				<!-- Name & Email -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label
							for="contact-name"
							class="mb-2 block text-xs font-bold tracking-wider text-white/70 uppercase"
						>
							Your Name
						</label>
						<input
							id="contact-name"
							{...submitContact.fields.name.as('text')}
							placeholder="Alex Morgan"
							class="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/25 focus:outline-none sm:text-sm"
						/>
						{#each submitContact.fields.name.issues() as issue}
							<p class="mt-1.5 text-xs text-red-400">{issue.message}</p>
						{/each}
					</div>

					<div>
						<label
							for="contact-email"
							class="mb-2 block text-xs font-bold tracking-wider text-white/70 uppercase"
						>
							Work Email
						</label>
						<input
							id="contact-email"
							{...submitContact.fields.email.as('email')}
							placeholder="alex@company.com"
							class="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/25 focus:outline-none sm:text-sm"
						/>
						{#each submitContact.fields.email.issues() as issue}
							<p class="mt-1.5 text-xs text-red-400">{issue.message}</p>
						{/each}
					</div>
				</div>

				<!-- Message -->
				<div>
					<label
						for="contact-message"
						class="mb-2 block text-xs font-bold tracking-wider text-white/70 uppercase"
					>
						Product Hypothesis &amp; Goals
					</label>
					<textarea
						id="contact-message"
						rows={4}
						{...submitContact.fields.message.as('text')}
						placeholder="What are you building, who is the target buyer, and what decision do you need validated?"
						class="w-full resize-none rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/25 focus:outline-none sm:text-sm"
					></textarea>
					{#each submitContact.fields.message.issues() as issue}
						<p class="mt-1.5 text-xs text-red-400">{issue.message}</p>
					{/each}
				</div>

				<!-- Submit -->
				<div class="flex flex-wrap items-center justify-between gap-4 pt-2">
					<button
						disabled={Boolean(submitContact.pending)}
						type="submit"
						class="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1d4ed8] hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2"
					>
						{submitContact.pending ? 'Sending...' : 'Request Validation Scope'}
						<ArrowRight size={15} strokeWidth={2.2} />
					</button>
					<p class="text-xs text-white/60">
						Or email directly at <a
							href="mailto:contact@nivabit.com"
							class="text-sky-400 underline underline-offset-2 hover:text-sky-300">contact@nivabit.com</a
						>
					</p>
				</div>
			</form>
		</div>
	</div>
</section>
