<script lang="ts">
	import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-svelte';
	import Label from '#lib/components/ui/label/label.svelte';
	import { loginAdmin } from '#lib/remote/auth.remote.ts';
	import { loginSchema } from '#lib/validation/validation.ts';
	import NivabitLogo from '#lib/components/icon/NivabitLogo.svelte';

	let showPassword = $state(false);
	let loading = $derived(Boolean(loginAdmin.pending));
	let rootIssues = $derived(
		(loginAdmin.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);
</script>

<svelte:head>
	<title>CEO Login | Nivabit Command Center</title>
</svelte:head>

<section class="relative flex min-h-screen w-full items-center justify-center bg-[#090d14] px-4 py-12 text-slate-100 selection:bg-[#0284c7]/20 selection:text-[#38bdf8]">
	<!-- Ambient Background Glow -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#0284c7]/10 blur-3xl"></div>
		<div class="absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-[#0284c7]/5 blur-3xl"></div>
	</div>

	<div class="relative w-full max-w-md">
		<!-- Header Mark -->
		<div class="mb-8 text-center">
			<a href="/" class="inline-flex items-center justify-center transition-opacity hover:opacity-85">
				<NivabitLogo variant="light" class="h-8 w-auto" />
			</a>
			<div class="mt-4 flex items-center justify-center gap-2">
				<span class="h-2 w-2 rounded-[1.5px] bg-[#fa8212]"></span>
				<p class="font-mono text-xs font-bold tracking-widest text-[#fa8212] uppercase">
					CEO COMMAND CENTER
				</p>
			</div>
			<p class="mt-1 text-xs text-slate-400">
				Sign in to access articles, metrics, newsletter &amp; bookings
			</p>
		</div>

		<!-- Login Card -->
		<div class="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl text-slate-900">
			<form
				class="space-y-5"
				{...loginAdmin.preflight(loginSchema).enhance(async ({ submit }) => {
					const ok = await submit();
					if (ok) {
						window.location.href = '/ceo';
					}
				})}
				oninput={() => loginAdmin.validate()}
			>
				<div>
					<Label for="email" class="mb-1.5 block text-xs font-bold text-slate-700">
						CEO Email Address
					</Label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
							<Mail class="h-4 w-4 text-slate-400" />
						</div>
						<input
							id="email"
							{...loginAdmin.fields.email.as('email')}
							class="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-4 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/15 focus:outline-none"
							placeholder="admin@nivabit.com"
						/>
					</div>

					{#each loginAdmin.fields.email.issues() as issue}
						<p class="mt-1 text-xs text-red-500">{issue.message}</p>
					{/each}
				</div>

				<div>
					<Label for="password" class="mb-1.5 block text-xs font-bold text-slate-700">
						Password
					</Label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
							<Lock class="h-4 w-4 text-slate-400" />
						</div>
						<input
							id="password"
							{...loginAdmin.fields._password.as(showPassword ? 'text' : 'password')}
							class="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/15 focus:outline-none"
							placeholder="Enter password"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
							aria-label="Toggle password visibility"
						>
							{#if showPassword}
								<EyeOff class="h-4 w-4" />
							{:else}
								<Eye class="h-4 w-4" />
							{/if}
						</button>
					</div>

					{#each loginAdmin.fields._password.issues() as issue}
						<p class="mt-1 text-xs text-red-500">{issue.message}</p>
					{/each}
				</div>

				{#each rootIssues as issue}
					<div class="rounded-xl border border-red-200 bg-red-50 p-3">
						<p class="text-xs font-medium text-red-600">{issue.message}</p>
					</div>
				{/each}

				<div class="flex items-center justify-between text-xs">
					<a
						href="/ceo/forgotpassword"
						class="font-medium text-[#0284c7] hover:underline"
					>
						Forgot password?
					</a>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0284c7] py-3 text-xs font-bold text-white shadow-md shadow-[#0284c7]/20 transition-all hover:bg-[#0369a1] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if loading}
						<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
						Signing in...
					{:else}
						Sign In to CEO Suite
					{/if}
				</button>
			</form>
		</div>

		<!-- Back Link -->
		<div class="mt-6 text-center">
			<a
				href="/"
				class="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white"
			>
				<ArrowLeft class="h-3.5 w-3.5" />
				Back to Nivabit website
			</a>
		</div>
	</div>
</section>
