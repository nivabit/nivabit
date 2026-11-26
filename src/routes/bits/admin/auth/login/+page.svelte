<script lang="ts">
	import CustomButton from '#lib/components/customUI/button/customButton.svelte';
	import MainButton from '#lib/components/customUI/button/MainButton.svelte';
	import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-svelte';
	import Label from '#lib/components/ui/label/label.svelte';
	import { loginAdmin } from '#lib/remote/auth.remote.ts';
	import { loginSchema } from '#lib/validation/validation.ts';

	let showPassword = $state(false);
	let loading = $derived(Boolean(loginAdmin.pending));
	let rootIssues = $derived(
		(loginAdmin.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);
</script>

<section class="flex min-h-screen w-full items-center justify-center bg-brand-blue-900 px-4">
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-brand-orange-500/5"></div>
		<div class="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-white/5"></div>
	</div>

	<div class="relative w-full max-w-md">
		<div class="relative w-full">
			<div class="mb-8 text-center">
				<a href="/" class="inline-block">
					<img src="/images/logo.png" alt="Nivabit Logo" class="mx-auto mb-4 h-8 w-auto" />
				</a>
				<p class="font-synonym text-brand-blue-100">Access your admin dashboard</p>
			</div>

			<div class="rounded-2xl bg-white p-8 shadow-2xl">
				<form
					class="space-y-6"
					{...loginAdmin.preflight(loginSchema).enhance(async ({ submit }) => {
						const ok = await submit();
						if (ok) {
							window.location.href = '/bits/admin/dashboard';
						}
					})}
					oninput={() => loginAdmin.validate()}
				>
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
							<input
								id="email"
								{...loginAdmin.fields.email.as('email')}
								class="font-synonym block w-full rounded-lg border border-brand-grey-50 py-3 pr-4 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
								placeholder="admin@nivabit.com"
							/>
						</div>

						{#each loginAdmin.fields.email.issues() as issue}
							<p class="text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>

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
							<input
								id="password"
								{...loginAdmin.fields._password.as(showPassword ? 'text' : 'password')}
								class="font-synonym w-full rounded-lg border border-brand-grey-50 py-3 pr-12 pl-10 transition-colors placeholder:text-brand-grey-200 focus:border-transparent focus:ring-2 focus:ring-brand-orange-500 focus:outline-none"
								placeholder="Enter your password"
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

						{#each loginAdmin.fields._password.issues() as issue}
							<p class="text-sm text-red-500">{issue.message}</p>
						{/each}
					</div>

					{#each rootIssues as issue}
						<div class="rounded-lg border border-red-200 bg-red-50 p-3">
							<p class="font-synonym text-sm text-red-600">{issue.message}</p>
						</div>
					{/each}

					<div class="flex items-center justify-between">
						<CustomButton
							href="/bits/admin/auth/forgotpassword"
							className="text-sm text-brand-orange-500 hover:text-brand-orange-500/80 font-synonym transition-colors"
						>
							Forgot password?
						</CustomButton>
					</div>

					<MainButton
						type="submit"
						disabled={loading}
						class="font-synonym w-full rounded-lg bg-brand-orange-500 font-medium text-white transition-colors hover:bg-brand-orange-500/90 focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
