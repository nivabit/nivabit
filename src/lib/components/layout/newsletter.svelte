<script lang="ts">
	import { enhance } from '$app/forms';
	import { reveal } from '$lib/actions/reveal';
	import { revealWords } from '$lib/actions/revealWords';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import MainButton from '../customUI/button/MainButton.svelte';
	import Input from '../ui/input/input.svelte';
	import { ArrowRight } from 'lucide-svelte';

	let { class: customClass = '' } = $props();
	let isLoading = $state(false)
	let formError: Record<string, string> | undefined = $state({});
	let email = $state('');

</script>

<!-- {/* Newsletter Section */} -->
<section class={cn(`bg-bg-blue px-4 py-16 md:px-16 md:py-24`, customClass)}>
	<div class="mx-auto max-w-7xl">
		<div class="flex flex-col items-start gap-12 lg:flex-row lg:gap-24">
			<div use:reveal class="reveal w-full flex-shrink-0 lg:w-96">
				<p class="text-lg text-brand-grey-500">Newsletter</p>
			</div>

			<div class="flex-1 space-y-10">
				<div>
					<h2
						use:revealWords
						class="reveal-words mb-3 text-2xl font-medium text-brand-grey-500 md:text-3xl"
					>
						Get Our Latest Insights on Topics
					</h2>
					<p use:reveal class="reveal text-lg leading-relaxed text-brand-grey-500">
						Our creative team transforms strategic insights into beautiful, functional designs
						through iterative prototyping, user testing, and refinement until every pixel aligns
						with your brand and business goals.
					</p>
				</div>

				<form use:reveal class="reveal" method="POST" 
					action="/"
					use:enhance={() => {
						isLoading = true;
						formError = {};
						return async ({ result }) => {
							isLoading = false;
							if (result.type === 'failure') {
								formError = result.data?.errors || result.data?.error  as any;
							} 
							if (result.type === 'error') {
								formError = result.error as any;
								toast.error(result.error || 'An unexpected error occurred. Please try again.');
							}
							else if (result.type === 'success') {
								toast.success('Password reset link sent to your email.');
								email = '';
								formError = {}
							}
						};
					}}
				>

					{#if formError?.email}
						<div class="rounded-lg border border-red-200 bg-red-50 p-3 mb-3">
							<p class="text-sm text-red-600">{formError.email}</p>
						</div>
					{/if}
					<div class="flex max-w-lg items-center gap-3 rounded-full bg-white p-1">
						<Input
							required
							name="email"
							type="email"
							bind:value={email}
							placeholder="Your Email"
							class="placeholder:text-text-grey focus:ring-none flex-1 rounded-full border-none bg-white px-5  py-3 text-brand-grey-500 shadow-none focus:border-none focus:ring-brand-orange-500 focus:outline-none focus-visible:outline-none outline-0 border-0 focus-visible:ring-0"
						/>
						<MainButton
							disabled={isLoading}
							type="submit"
							class="flex flex-shrink-0 items-center gap-2 rounded-full bg-brand-orange-500 text-sm  text-white transition-colors hover:bg-brand-orange-500/90"
						>
							{#if isLoading}
								<div class="flex items-center justify-center">
									<div
										class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
									Subscribing...
								</div>
							{:else}
								Subscribe
							{/if}
							
							<ArrowRight />
						</MainButton>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>
