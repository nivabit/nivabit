<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-svelte';
	import { get } from 'svelte/store';
	import { enhance } from '$app/forms';

	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $state(false);
	let isSuccess = $state(false);
	let error = $state('');
	let token = $state('');
	let isValidToken = $state(true);
	let formError: Record<string, string> | undefined = $state({});

	onMount(() => {
		const url = get(page).url;
		const tokenParam = url.searchParams.get('token');
		if (tokenParam) {
			token = tokenParam;
			isValidToken = tokenParam.length >= 10;
		} else {
			isValidToken = false;
		}
	});

	// --- Password Validation ---
	const validatePassword = (pwd: string) => {
		const minLength = pwd.length >= 8;
		const hasUpperCase = /[A-Z]/.test(pwd);
		const hasLowerCase = /[a-z]/.test(pwd);
		const hasNumbers = /\d/.test(pwd);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

		return {
			minLength,
			hasUpperCase,
			hasLowerCase,
			hasNumbers,
			hasSpecialChar,
			isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
		};
	};

	const passwordValidation = $derived(validatePassword(password));
	const passwordsMatch = $derived(password === confirmPassword && confirmPassword !== '');
</script>

{#if !isValidToken}
	<!-- Invalid token UI -->
	<div class="flex min-h-screen items-center justify-center bg-brand-blue-900 px-4">
		<div class="relative w-full max-w-md">
			<div class="mb-8 text-center">
				<img src="/images/logo.png" alt="Nivabit Logo" class="mx-auto mb-4 h-8 w-auto" />
				<h1 class="font-cabinet mb-2 text-2xl font-medium text-white md:text-3xl">
					Invalid Reset Link
				</h1>
				<p class="font-synonym text-brand-blue-100">
					This password reset link is invalid or has expired
				</p>
			</div>

			<div class="rounded-2xl bg-white p-8 text-center shadow-2xl">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
				>
					<AlertCircle class="h-8 w-8 text-red-600" />
				</div>

				<h3 class="font-cabinet mb-2 text-lg font-medium text-brand-grey-500">
					Link Expired or Invalid
				</h3>
				<p class="font-synonym mb-6 text-sm text-brand-grey-400">
					Please request a new password reset link
				</p>

				<a
					href="/forgot-password"
					class="font-synonym inline-block w-full rounded-lg bg-brand-orange-500 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-brand-orange-500/90"
				>
					Request New Link
				</a>
			</div>

			<div class="mt-6 text-center">
				<a
					href="/login"
					class="font-synonym inline-flex items-center gap-2 text-sm text-brand-blue-100 transition-colors hover:text-white"
				>
					Back to login
				</a>
			</div>
		</div>
	</div>
{:else}
	<!-- Valid token UI -->
	<div class="flex min-h-screen items-center justify-center bg-brand-blue-900 px-4">
		<div class="absolute inset-0 overflow-hidden">
			<div
				class="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-brand-orange-500 opacity-5"
			></div>
			<div class="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-white opacity-5"></div>
		</div>

		<div class="relative w-full max-w-md">
			<div class="mb-8 text-center">
				<a href="/" class="inline-block">
					<img src="/images/logo.png" alt="Nivabit Logo" class="mx-auto mb-4 h-8 w-auto" />
				</a>
				<h1 class="font-cabinet mb-2 text-2xl font-medium text-white md:text-3xl">
					{isSuccess ? 'Password Reset Complete' : 'Create New Password'}
				</h1>
				<p class="font-synonym text-brand-blue-100">
					{isSuccess
						? 'Your password has been successfully updated'
						: 'Please create a strong password for your account'}
				</p>
			</div>

			<div class="rounded-2xl bg-white p-8 shadow-2xl">
				{#if !isSuccess}
					<!-- Reset form -->
					<form
						method="post"
						action="?/resetPassword"
						use:enhance={() => {
							isLoading = true;
							formError = {};
							return async ({ result }) => {
								isLoading = false;
								if (result.type === 'failure') {
									formError = result.data?.errors || ({ error: 'Failed to reset password' } as any);
								} else if (result.type === 'success') {
									isSuccess = true;
									setTimeout(() => {
										window.location.href = '/login';
									}, 3000);
								}
							};
						}}
					>
						<!-- New Password -->
						<div>
							<label
								for="password"
								class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500"
							>
								New Password
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock class="h-5 w-5 text-brand-grey-200" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									bind:value={password}
									required
									class="font-synonym w-full rounded-lg border border-brand-grey-50 py-3 pr-12 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
									placeholder="Enter new password"
								/>
								<button
									type="button"
									onclick={() => (showPassword = !showPassword)}
									class="absolute inset-y-0 right-0 flex items-center pr-3"
								>
									{#if showPassword}
										<EyeOff
											class="h-5 w-5 text-brand-grey-200 transition-colors hover:text-brand-grey-400"
										/>
									{:else}
										<Eye
											class="h-5 w-5 text-brand-grey-200 transition-colors hover:text-brand-grey-400"
										/>
									{/if}
								</button>
							</div>
						</div>

						<!-- Password requirements -->
						{#if password}
							<div class="rounded-lg border border-brand-blue-100 bg-bg-blue p-4">
								<h4 class="font-synonym mb-2 text-sm font-medium text-brand-grey-500">
									Password Requirements:
								</h4>
								<div class="font-synonym space-y-1 text-xs">
									<div
										class={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-brand-grey-400'}`}
									>
										<div
											class={`h-1.5 w-1.5 rounded-full ${passwordValidation.minLength ? 'bg-green-600' : 'bg-brand-grey-200'}`}
										></div>
										At least 8 characters
									</div>
									<div
										class={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-brand-grey-400'}`}
									>
										<div
											class={`h-1.5 w-1.5 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-600' : 'bg-brand-grey-200'}`}
										></div>
										One uppercase letter
									</div>
									<div
										class={`flex items-center gap-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-brand-grey-400'}`}
									>
										<div
											class={`h-1.5 w-1.5 rounded-full ${passwordValidation.hasLowerCase ? 'bg-green-600' : 'bg-brand-grey-200'}`}
										></div>
										One lowercase letter
									</div>
									<div
										class={`flex items-center gap-2 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-brand-grey-400'}`}
									>
										<div
											class={`h-1.5 w-1.5 rounded-full ${passwordValidation.hasNumbers ? 'bg-green-600' : 'bg-brand-grey-200'}`}
										></div>
										One number
									</div>
									<div
										class={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-brand-grey-400'}`}
									>
										<div
											class={`h-1.5 w-1.5 rounded-full ${passwordValidation.hasSpecialChar ? 'bg-green-600' : 'bg-brand-grey-200'}`}
										></div>
										One special character
									</div>
								</div>
							</div>
						{/if}

						<!-- Confirm Password -->
						<div>
							<label
								for="confirmPassword"
								class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500"
							>
								Confirm New Password
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock class="h-5 w-5 text-brand-grey-200" />
								</div>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									bind:value={confirmPassword}
									required
									class="font-synonym w-full rounded-lg border border-brand-grey-50 py-3 pr-12 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
									placeholder="Confirm new password"
								/>
								<button
									type="button"
									onclick={() => (showConfirmPassword = !showConfirmPassword)}
									class="absolute inset-y-0 right-0 flex items-center pr-3"
								>
									{#if showConfirmPassword}
										<EyeOff
											class="h-5 w-5 text-brand-grey-200 transition-colors hover:text-brand-grey-400"
										/>
									{:else}
										<Eye
											class="h-5 w-5 text-brand-grey-200 transition-colors hover:text-brand-grey-400"
										/>
									{/if}
								</button>
							</div>
							{#if confirmPassword && !passwordsMatch}
								<p class="font-synonym mt-1 text-xs text-red-600">Passwords do not match</p>
							{:else if confirmPassword && passwordsMatch}
								<p class="font-synonym mt-1 text-xs text-green-600">Passwords match</p>
							{/if}
						</div>

						<!-- Error -->
						{#if error}
							<div class="rounded-lg border border-red-200 bg-red-50 p-3">
								<p class="font-synonym text-sm text-red-600">{error}</p>
							</div>
						{/if}

						<!-- Submit -->
						<button
							type="submit"
							disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
							class="font-synonym w-full rounded-lg bg-brand-orange-500 px-4 py-3 font-medium text-white transition-colors hover:bg-brand-orange-500/90 focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isLoading}
								<div class="flex items-center justify-center">
									<div
										class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
									Updating Password...
								</div>
							{:else}
								Update Password
							{/if}
						</button>
					</form>
				{:else}
					<!-- Success -->
					<div class="space-y-6 text-center">
						<div
							class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
						>
							<CheckCircle class="h-8 w-8 text-green-600" />
						</div>
						<div class="space-y-2">
							<h3 class="font-cabinet text-lg font-medium text-brand-grey-500">
								Password Updated Successfully
							</h3>
							<p class="font-synonym text-sm text-brand-grey-400">
								Your password has been changed. You will be redirected to the login page.
							</p>
						</div>
						<div class="rounded-lg border border-brand-blue-100 bg-bg-blue p-4">
							<p class="font-synonym text-xs text-brand-grey-400">
								Redirecting to login page in 3 seconds...
							</p>
						</div>
						<a
							href="/bits/admin/auth/login"
							class="font-synonym inline-block w-full rounded-lg bg-brand-orange-500 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-brand-orange-500/90"
						>
							Go to Login
						</a>
					</div>
				{/if}
			</div>

			<!-- Back to login -->
			{#if !isSuccess}
				<div class="mt-6 text-center">
					<a
						href="/bits/admin/auth/login"
						class="font-synonym inline-flex items-center gap-2 text-sm text-brand-blue-100 transition-colors hover:text-white"
					>
						Back to login
					</a>
				</div>
			{/if}
		</div>
	</div>
{/if}
