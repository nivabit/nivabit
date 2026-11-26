<script lang="ts">
	import { cn } from '#lib/utils.ts';
	import { toast } from 'svelte-sonner';
	import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-svelte';
	import { subscribeNewsletter } from '#lib/remote/newsletter.remote.ts';
	import { subscribeNewsletterSchema } from '#lib/validation/validation.ts';
	import NivabitLogo from '#lib/components/icon/NivabitLogo.svelte';

	let { class: customClass = '' } = $props();
</script>

<!-- Dark Obsidian Spotlight Band (Matches Reference Dark Feature Showcase) -->
<section
	id="newsletter"
	class={cn('relative overflow-hidden bg-surface-dark px-4 py-20 text-white md:px-8 md:py-24', customClass)}
>
	<div class="mx-auto max-w-5xl">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
			<!-- Left Copy & Remote Form -->
			<div class="space-y-6 lg:col-span-7">
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/40 bg-brand-accent/15 px-3 py-1 text-[11px] font-bold tracking-wider text-brand-accent-light uppercase"
				>
					<Sparkles size={12} />
					The Validation Memo • Weekly
				</span>

				<h2
					class="font-cabinet text-3xl leading-[1.08] font-extrabold tracking-[-0.025em] text-white sm:text-4xl"
				>
					Unserved market gaps &amp; idea teardowns, delivered every Tuesday.
				</h2>

				<p class="max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
					Every week we break down one validated market opportunity, real customer willingness-to-pay
					signals, and competitor vulnerabilities. Join 2,500+ founders who read before they build.
				</p>

				<form
					class="pt-1"
					{...subscribeNewsletter.preflight(subscribeNewsletterSchema).enhance(async ({ form, submit }) => {
						const ok = await submit();
						if (!ok) return;
						toast.success(
							'You are on the list! Check your inbox for your first research teardown.'
						);
						form.reset();
					})}
					oninput={() => subscribeNewsletter.validate()}
				>
					{#each subscribeNewsletter.fields.email.issues() as issue}
						<div class="mb-3 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5">
							<p class="text-xs text-red-300">{issue.message}</p>
						</div>
					{/each}

					<div
						class="flex max-w-md flex-col gap-2.5 sm:flex-row sm:items-center sm:rounded-full sm:border sm:border-white/15 sm:bg-white/[0.06] sm:p-1.5"
					>
						<input
							required
							{...subscribeNewsletter.fields.email.as('email')}
							placeholder="founder@company.com"
							class="w-full flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand-accent focus:outline-none sm:border-0 sm:bg-transparent sm:py-2"
						/>
						<button
							disabled={Boolean(subscribeNewsletter.pending)}
							type="submit"
							class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-brand-accent px-5 py-3 text-xs font-extrabold text-white transition-colors hover:bg-brand-accent-hover disabled:opacity-60 sm:py-2.5"
						>
							{#if subscribeNewsletter.pending}
								Subscribing...
							{:else}
								Join The Memo
								<ArrowRight size={14} strokeWidth={2.5} />
							{/if}
						</button>
					</div>

					<p class="mt-3 text-[11px] text-white/45">
						Zero spam. Pure research and demand data. Unsubscribe in 1 click.
					</p>
				</form>
			</div>

			<!-- Right Tilted 3D Validation Dossier Preview Card -->
			<div class="flex justify-center lg:col-span-5 lg:justify-end">
				<div
					class="relative w-full max-w-[300px] -rotate-2 rounded-3xl border border-white/15 bg-gradient-to-b from-[#131B2E] to-[#0B0F1A] p-6 shadow-2xl shadow-black/60 transition-transform duration-500 hover:rotate-0"
				>
					<div class="flex items-center justify-between border-b border-white/10 pb-4">
						<div class="flex items-center gap-2">
							<NivabitLogo variant="light" iconOnly class="h-5 w-5" />
							<span class="font-cabinet text-xs font-bold text-white">THE VALIDATION MEMO</span>
						</div>
						<span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
							Issue #42
						</span>
					</div>

					<div class="mt-5 space-y-3">
						<p class="text-[10px] font-bold tracking-wider text-brand-accent-light uppercase">
							Market Teardown Scorecard
						</p>
						<h3 class="font-cabinet text-lg leading-tight font-extrabold text-white">
							B2B Fleet Compliance &amp; Automated Audit SaaS
						</h3>

						<div class="space-y-2.5 pt-2">
							<div>
								<div class="mb-1 flex justify-between text-[11px]">
									<span class="text-white/60">Pain Urgency</span>
									<span class="font-bold text-brand-accent-light">92/100</span>
								</div>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
									<div class="h-full w-[92%] rounded-full bg-brand-accent"></div>
								</div>
							</div>

							<div>
								<div class="mb-1 flex justify-between text-[11px]">
									<span class="text-white/60">Willingness to Pay</span>
									<span class="font-bold text-brand-accent-light">84/100</span>
								</div>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
									<div class="h-full w-[84%] rounded-full bg-brand-accent"></div>
								</div>
							</div>

							<div>
								<div class="mb-1 flex justify-between text-[11px]">
									<span class="text-white/60">Whitespace Moat</span>
									<span class="font-bold text-brand-accent-light">88/100</span>
								</div>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
									<div class="h-full w-[88%] rounded-full bg-brand-accent"></div>
								</div>
							</div>
						</div>

						<div
							class="mt-4 flex items-center justify-between rounded-xl border border-brand-accent/40 bg-brand-accent/15 px-3.5 py-2.5"
						>
							<span class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent-light">
								<CheckCircle2 size={14} />
								VERDICT: GO
							</span>
							<span class="font-cabinet text-xs font-extrabold text-white">88 / 100</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
