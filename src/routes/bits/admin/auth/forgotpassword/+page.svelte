<script lang="ts">
	import { enhance } from '$app/forms';
	import CustomButton from '$lib/components/customUI/button/customButton.svelte';
	import MainButton from '$lib/components/customUI/button/MainButton.svelte';
	import { Mail, ArrowLeft, CheckCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let email = $state('');
	let isLoading = $state(false);
	let isEmailSent = $state(false);
	let formError: Record<string, string> | undefined = $state({});
</script>

<div class="flex min-h-screen items-center justify-center bg-brand-blue-900 px-4">
	<!-- Background decoration -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-brand-orange-500 opacity-5"
		></div>
		<div class="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-white opacity-5"></div>
	</div>

	<div class="relative w-full max-w-md">
		<!-- Logo -->
		<div class="mb-8 text-center">
			<a href="/" class="inline-block">
				<img src="/images/logo.png" alt="Nivabit Logo" class="mx-auto mb-4 h-8 w-auto" />
			</a>
			<h1 class="font-cabinet mb-2 text-2xl font-medium text-white md:text-3xl">
				{#if isEmailSent}
					Check Your Email
				{:else}
					Forgot Password?
				{/if}
			</h1>
			<p class="font-synonym text-brand-blue-100">
				{#if isEmailSent}
					We've sent password reset instructions to your email
				{:else}
					Enter your email address and we'll send you a link to reset your password
				{/if}
			</p>
		</div>

		<!-- Main Content -->
		<div class="rounded-2xl bg-white p-8 shadow-2xl">
			{#if !isEmailSent}
				<!-- Forgot Password Form -->
				<form
					method="post"
					action="?/forgotPassword"
					class="space-y-6"
					use:enhance={() => {
						isLoading = true;
						formError = {};
						return async ({ result }) => {
							isLoading = false;
							if (result.type === 'failure') {
								formError = result.data?.errors as any;
							} 
							if (result.type === 'error') {
								formError = result.error as any;
								toast.error(result.error || 'An unexpected error occurred. Please try again.');
							}
							else if (result.type === 'success') {
								isEmailSent = true;
								toast.success('Password reset link sent to your email.');
							}
						};
					}}
				>
					<!-- Email Field -->
					<div>
						<label
							for="email"
							class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500"
						>
							Email Address
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Mail class="h-5 w-5 text-brand-grey-200" />
							</div>
							<input
								id="email"
								type="email"
								required
								name="email"
								bind:value={email}
								class="font-synonym w-full rounded-lg border border-brand-grey-50 py-3 pr-4 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
								placeholder="Enter your email address"
							/>
						</div>
						{#if formError?.email}
							<p class="text-sm text-red-500">{formError.email}</p>
						{/if}
					</div>

					<!-- API Error -->
					{#if formError?.errors}
						<div class="rounded-lg border border-red-200 bg-red-50 p-3">
							<p class="text-sm text-red-600">{formError.errors}</p>
						</div>
					{/if}

					<!-- Submit Button -->
					<MainButton
						type="submit"
						disabled={isLoading}
						class="font-synonym w-full rounded-lg bg-brand-orange-500 font-medium text-white transition-colors hover:bg-brand-orange-500/90 focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isLoading}
							<div class="flex items-center justify-center">
								<div
									class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Sending...
							</div>
						{:else}
							Send Reset Link
						{/if}
					</MainButton>
				</form>
			{:else}
				<!-- Email Sent Confirmation -->
				<div class="space-y-6 text-center">
					<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle class="h-8 w-8 text-green-600" />
					</div>

					<div class="space-y-2">
						<h3 class="font-cabinet text-lg font-medium text-brand-grey-500">
							Email Sent Successfully
						</h3>
						<p class="font-synonym text-sm text-brand-grey-400">
							We've sent a password reset link to <strong>{email}</strong>
						</p>
					</div>

					<div class="rounded-lg border border-brand-blue-100 bg-bg-blue p-4">
						<p class="font-synonym mb-2 text-xs text-brand-grey-400">
							Didn't receive the email? Check your spam folder or try again.
						</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Back to Login -->
		<div class="mt-6 text-center">
			<CustomButton
				href="/bits/admin/auth/login"
				className="inline-flex items-center gap-2 text-brand-blue-100 font-synonym text-sm transition-colors"
			>
				<div class="inline-flex items-center gap-2 text-brand-blue-100">
					<ArrowLeft class="h-4 w-4" />
					Back to login
				</div>
			</CustomButton>
		</div>
	</div>
</div>
