<script lang="ts">
	import CustomButton from '$lib/components/customUI/button/customButton.svelte';
	import MainButton from '$lib/components/customUI/button/MainButton.svelte';
	import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-svelte';
	import { loginSchema } from '$lib/validation/validation';
	import { accessToken, adminUser } from '../../../../../hooks.client';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { enhance } from '$app/forms';

	let showPassword = $state(false);
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let formError: Record<string, string[]> | undefined = $state({});
</script>

<section class="flex min-h-screen w-full items-center justify-center bg-brand-blue-900 px-4">
	<!-- {/* Background decoration */} -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-brand-orange-500/5"></div>
		<div class="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-white/5"></div>
	</div>

	<div class="relative w-full max-w-md">
		<div class="relative w-full">
			<!-- {/* Logo */} -->
			<div class="mb-8 text-center">
				<a href="/" class="inline-block">
					<img src="/images/logo.png" alt="Nivabit Logo" class="mx-auto mb-4 h-8 w-auto" />
				</a>
				<p class="font-synonym text-brand-blue-100">Access your admin dashboard</p>
			</div>

			<!-- {/* Login Form */} -->
			<div class="rounded-2xl bg-white p-8 shadow-2xl">
				<form
					method="post"
					action="?/login"
					class="space-y-6"
					use:enhance={() => {
						loading = true;
						formError = {};
						return async ({ result }) => {
							loading = false;
							console.log(result);

							if (result.type === 'failure' && result.data) {
								formError = result.data?.errors as any;
							} else if (result.type === 'error') {
								formError = { errors: result.error.message || result.error };
							} else if (result.type === 'success') {
								window.location.href = '/bits/admin/dashboard';
							}
						};
					}}
				>
					<!-- {/* Email Field */} -->
					<div>
						<Label
							for="email"
							class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500"
						>
							Email Address
						</Label>
						<div class="relative mb-2">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Mail class="h-5 w-5 text-brand-grey-200" />
							</div>
							<Input
								id="email"
								type="email"
								name="email"
								required
								bind:value={email}
								class="font-synonym block w-full rounded-lg border border-brand-grey-50 py-6 pr-4 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
								placeholder="admin@nivabit.com"
							/>
						</div>

						{#if formError?.email}
							<p class="text-sm text-red-500">{formError?.email}</p>
						{/if}
					</div>

					<!-- {/* Password Field */} -->
					<div>
						<Label
							for="password"
							class="font-synonym mb-2 block text-sm font-medium text-brand-grey-500"
						>
							Password
						</Label>
						<div class="relative mb-2">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Lock class="h-5 w-5 text-brand-grey-200" />
							</div>
							<Input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								required
								bind:value={password}
								class="font-synonym w-full rounded-lg border border-brand-grey-50 py-6 pr-12 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
								placeholder="Enter your password"
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

						{#if formError?.password}
							<p class="text-sm text-red-500">{formError?.password}</p>
						{/if}
					</div>

					<!-- API Error -->
					{#if formError?.errors}
						<div class="rounded-lg border border-red-200 bg-red-50 p-3">
							<p class="font-synonym text-sm text-red-600">{formError?.errors}</p>
						</div>
					{/if}

					<!-- {/* Remember Me & Forgot Password */} -->
					<div class="flex items-center justify-between">
						<CustomButton
							href="/bits/admin/auth/forgotpassword"
							className="text-sm text-brand-orange-500 hover:text-brand-orange-500/80 font-synonym transition-colors"
						>
							Forgot password?
						</CustomButton>
					</div>

					<!-- {/* Submit Button */} -->
					<MainButton
						type="submit"
						disabled={loading}
						class="font-synonym w-full rounded-lg bg-brand-orange-500 px-4 py-3 font-medium text-white transition-colors hover:bg-brand-orange-500/90 focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if loading}
							<div class="flex items-center justify-center">
								<div
									class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Signing in...
							</div>
						{:else}
							Sign In
						{/if}
					</MainButton>
				</form>
			</div>

			<!-- {/* Back to Website */} -->
			<div class="mt-6 text-center">
				<CustomButton
					href="/"
					className="inline-flex items-center gap-2 text-brand-blue-100 hover:text-white font-synonym text-sm transition-colors"
				>
					<div class="inline-flex items-center gap-2 text-brand-blue-100">
						<ArrowLeft class="h-4 w-4" />
						Back to website
					</div>
				</CustomButton>
			</div>
		</div>
	</div>
</section>
