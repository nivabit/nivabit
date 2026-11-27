<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-svelte';
	import MainButton from '#lib/components/customUI/button/MainButton.svelte';
	import CustomButton from '#lib/components/customUI/button/customButton.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { resetPassword } from '#lib/remote/auth.remote.ts';
	import { resetPasswordSchema } from '#lib/validation/validation.ts';

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $derived(Boolean(resetPassword.pending));
	let isSuccess = $state(false);
	let token = $state('');
	let isValidToken = $state(true);

	onMount(() => {
		const tokenParam = page.url.searchParams.get('token');
		if (tokenParam) {
			token = tokenParam;
			resetPassword.fields.token.set(tokenParam);
		} else {
			isValidToken = false;
		}
	});

	let passwordValue = $derived(resetPassword.fields._password.value() ?? '');
	let confirmValue = $derived(resetPassword.fields._confirmPassword.value() ?? '');

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

	const passwordValidation = $derived(validatePassword(passwordValue));
	const passwordsMatch = $derived(passwordValue === confirmValue && confirmValue !== '');
	const rootIssues = $derived(
		(resetPassword.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);
</script>

{#if !isValidToken}
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
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
					<AlertCircle class="h-8 w-8 text-red-600" />
				</div>

				<h3 class="font-cabinet mb-2 text-lg font-medium text-brand-grey-500">
					Link Expired or Invalid
				</h3>
				<p class="font-synonym mb-6 text-sm text-brand-grey-400">
					Please request a new password reset link
				</p>

				<a
					href="/ceo/forgotpassword"
					class="font-synonym inline-block w-full rounded-lg bg-[#2563eb] px-4 py-3 text-center font-medium text-white transition-colors hover:bg-[#2563eb]/90"
				>
					Request New Link
				</a>
			</div>

			<div class="mt-6 text-center">
				<a
					href="/ceo/login"
					class="font-synonym inline-flex items-center gap-2 text-sm text-brand-blue-100 transition-colors hover:text-white"
				>
					Back to login
				</a>
			</div>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-brand-blue-900 px-4">
		<div class="absolute inset-0 overflow-hidden">
			<div class="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-[#2563eb] opacity-5"></div>
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
					<form
						class="space-y-6"
						{...resetPassword.preflight(resetPasswordSchema).enhance(async ({ submit }) => {
							const ok = await submit();
							if (!ok) return;
							isSuccess = true;
							toast.success('Password updated successfully. Redirecting to login...');
							setTimeout(() => {
								window.location.href = '/ceo/login';
							}, 3000);
						})}
						oninput={() => resetPassword.validate()}
					>
						<input {...resetPassword.fields.token.as('hidden', token)} />

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
									{...resetPassword.fields._password.as(showPassword ? 'text' : 'password')}
									class="font-synonym w-full rounded-lg border border-brand-grey-50 py-3 pr-12 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
									placeholder="Enter new password"
								/>
								<button
									type="button"
									onclick={() => (showPassword = !showPassword)}
									class="absolute inset-y-0 right-0 flex items-center pr-3"
								>
									{#if showPassword}
										<EyeOff class="h-5 w-5 text-brand-grey-200 transition-colors hover:text-brand-grey-400" />
									{:else}
										<Eye class="h-5 w-5 text-brand-grey-200 transition-colors hover:text-brand-grey-400" />
									{/if}
								</button>
							</div>
							{#each resetPassword.fields._password.issues() as issue}
								<p class="mt-1 text-sm text-red-600">{issue.message}</p>
							{/each}
						</div>

						{#if passwordValue}
							<div class="rounded-lg border border-brand-blue-100 bg-bg-blue p-4">
								<h4 class="font-synonym mb-2 text-sm font-medium text-brand-grey-500">
									Password Requirements:
								</h4>
								<div class="font-synonym space-y-1 text-xs">
									{#each [
										{ label: 'At least 8 characters', ok: passwordValidation.minLength },
										{ label: 'One uppercase letter', ok: passwordValidation.hasUpperCase },
										{ label: 'One lowercase letter', ok: passwordValidation.hasLowerCase },
										{ label: 'One number', ok: passwordValidation.hasNumbers },
										{ label: 'One special character', ok: passwordValidation.hasSpecialChar }
									] as req}
										<div class={`flex items-center gap-2 ${req.ok ? 'text-green-600' : 'text-brand-grey-400'}`}>
											<div class={`h-1.5 w-1.5 rounded-full ${req.ok ? 'bg-green-600' : 'bg-brand-grey-200'}`}></div>
											{req.label}
										</div>
									{/each}
								</div>
							</div>
						{/if}

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
									{...resetPassword.fields._confirmPassword.as(
										showConfirmPassword ? 'text' : 'password'
									)}
									class="font-synonym w-full rounded-lg border border-brand-grey-50 py-3 pr-12 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-[#2563eb] focus:outline-none"
									placeholder="Confirm new password"
								/>
								<button
									type="button"
									onclick={() => (showConfirmPassword = !showConfirmPassword)}
									class="absolute inset-y-0 right-0 flex items-center pr-3"
								>
									{#if showConfirmPassword}
										<EyeOff class="h-5 w-5 text-brand-grey-200 transition-colors hover:text-brand-grey-400" />
									{:else}
										<Eye class="h-5 w-5 text-brand-grey-200 transition-colors hover:text-brand-grey-400" />
									{/if}
								</button>
							</div>
							{#each resetPassword.fields._confirmPassword.issues() as issue}
								<p class="mt-1 text-sm text-red-600">{issue.message}</p>
							{/each}
							{#if confirmValue && passwordsMatch}
								<p class="font-synonym mt-1 text-xs text-green-600">Passwords match</p>
							{/if}
						</div>

						{#each resetPassword.fields.token.issues() as issue}
							<div class="rounded-lg border border-red-200 bg-red-50 p-3">
								<p class="text-sm text-red-600">{issue.message}</p>
							</div>
						{/each}

						{#each rootIssues as issue}
							<div class="rounded-lg border border-red-200 bg-red-50 p-3">
								<p class="text-sm text-red-600">{issue.message}</p>
							</div>
						{/each}

						<MainButton
							type="submit"
							disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
							class="font-synonym w-full rounded-lg bg-[#2563eb] font-medium text-white transition-colors hover:bg-[#2563eb]/90 focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
						</MainButton>
					</form>
				{:else}
					<div class="space-y-6 text-center">
						<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
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
						<CustomButton
							href="/ceo/login"
							className="inline-flex items-center gap-2 text-brand-blue-100 font-synonym text-sm transition-colors"
						>
							<div class="inline-flex items-center gap-2 text-brand-blue-100">
								<ArrowLeft class="h-4 w-4" />
								Back to login
							</div>
						</CustomButton>
					</div>
				{/if}
			</div>

			{#if !isSuccess}
				<div class="mt-6 text-center">
					<CustomButton
						href="/ceo/login"
						className="inline-flex items-center gap-2 text-brand-blue-100 font-synonym text-sm transition-colors"
					>
						<div class="inline-flex items-center gap-2 text-brand-blue-100">
							<ArrowLeft class="h-4 w-4" />
							Back to login
						</div>
					</CustomButton>
				</div>
			{/if}
		</div>
	</div>
{/if}
