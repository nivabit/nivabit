<script lang="ts">
	import { goto } from '$app/navigation';
	import { passwordRequirements } from '#lib/constants/passwordRequirements.js';
	import { Eye, EyeOff, Mail, Lock, Save, Loader } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import {
		getPlatformEmail,
		updatePlatformEmail,
		changeAdminPassword
	} from '#lib/remote/admin.remote.ts';
	import { platformEmailSchema, changePasswordSchema } from '#lib/validation/validation.ts';

	const platformEmailData = $derived(await getPlatformEmail());

	let showCurrent = $state(false);
	let showNew = $state(false);
	let showConfirm = $state(false);
	let initializedEmail = $state(false);

	$effect(() => {
		if (!initializedEmail && platformEmailData?.email) {
			initializedEmail = true;
			updatePlatformEmail.fields.set({
				email: platformEmailData.email
			});
		}
	});

	const newPasswordValue = $derived(changeAdminPassword.fields._newPassword.value() ?? '');
	const confirmPasswordValue = $derived(changeAdminPassword.fields._confirmPassword.value() ?? '');
	const passwordValidations = $derived(passwordRequirements(newPasswordValue));
	const isPasswordValid = $derived(
		passwordValidations.minLength &&
			passwordValidations.hasUpperCase &&
			passwordValidations.hasLowerCase &&
			passwordValidations.hasNumbers &&
			passwordValidations.hasSpecialChar
	);

	const emailRootIssues = $derived(
		(updatePlatformEmail.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);
	const passwordRootIssues = $derived(
		(changeAdminPassword.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);
</script>

<svelte:head>
	<title>Platform Settings | Nivabit CEO</title>
</svelte:head>

<div class="max-w-3xl space-y-6">
	<div>
		<div class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-[1.5px] bg-[#2563eb]"></span>
			<span class="font-mono text-xs font-bold tracking-wider text-[#2563eb] uppercase">
				Configuration
			</span>
		</div>
		<h1 class="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
			Platform Settings
		</h1>
		<p class="text-xs text-slate-500">
			Manage your platform notification email and admin password.
		</p>
	</div>

	<!-- Platform Email -->
	<form
		class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
		{...updatePlatformEmail.preflight(platformEmailSchema).enhance(async ({ submit }) => {
			const ok = await submit();
			if (!ok) return;
			toast.success('Platform email updated');
		})}
	>
		<div class="mb-4 flex items-center gap-2.5">
			<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
				<Mail class="h-4 w-4" />
			</span>
			<div>
				<h2 class="text-sm font-bold text-slate-900">Platform Email</h2>
				<p class="text-xs text-slate-500">
					Receives new strategy call bookings and contact form notifications.
				</p>
			</div>
		</div>

		{#each emailRootIssues as issue}
			<p class="mb-3 text-xs text-red-500">{issue.message}</p>
		{/each}

		<div class="flex flex-col gap-3 sm:flex-row sm:items-start">
			<div class="flex-1">
				<label for="platform-email" class="sr-only">Platform Email</label>
				<input
					id="platform-email"
					{...updatePlatformEmail.fields.email.as('email')}
					placeholder="contact@nivabit.com"
					class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
				/>
				{#each updatePlatformEmail.fields.email.issues() as issue}
					<p class="mt-1 text-xs text-red-500">{issue.message}</p>
				{/each}
			</div>

			<button
				type="submit"
				disabled={Boolean(updatePlatformEmail.pending)}
				class="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2563eb]/20 transition-colors hover:bg-[#1d4ed8] disabled:opacity-50"
			>
				{#if updatePlatformEmail.pending}
					<Loader class="h-3.5 w-3.5 animate-spin" />
					Saving...
				{:else}
					<Save class="h-3.5 w-3.5" />
					Save Email
				{/if}
			</button>
		</div>
	</form>

	<!-- Change Password -->
	<div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
		<div class="mb-5 flex items-center gap-2.5">
			<span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
				<Lock class="h-4 w-4" />
			</span>
			<div>
				<h2 class="text-sm font-bold text-slate-900">Change Password</h2>
				<p class="text-xs text-slate-500">Update your CEO portal login password.</p>
			</div>
		</div>

		<form
			class="space-y-4"
			{...changeAdminPassword.preflight(changePasswordSchema).enhance(async ({ form, submit }) => {
				const ok = await submit();
				if (!ok) return;
				form.reset();
				toast.success('Password changed successfully. Please login again.');
				goto('/ceo/login');
			})}
			oninput={() => changeAdminPassword.validate()}
		>
			{#each passwordRootIssues as issue}
				<p class="text-xs text-red-500">{issue.message}</p>
			{/each}

			<div>
				<label for="oldPassword" class="mb-1.5 block text-xs font-bold text-slate-700">
					Current Password
				</label>
				<div class="relative">
					<input
						id="oldPassword"
						{...changeAdminPassword.fields._oldPassword.as(showCurrent ? 'text' : 'password')}
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
						placeholder="Current password"
					/>
					<button
						type="button"
						onclick={() => (showCurrent = !showCurrent)}
						class="absolute top-2.5 right-3 cursor-pointer text-slate-400 hover:text-slate-700"
						aria-label="Toggle current password visibility"
					>
						{#if showCurrent}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
					</button>
				</div>
				{#each changeAdminPassword.fields._oldPassword.issues() as issue}
					<p class="mt-1 text-xs text-red-500">{issue.message}</p>
				{/each}
			</div>

			<div>
				<label for="newPassword" class="mb-1.5 block text-xs font-bold text-slate-700">
					New Password
				</label>
				<div class="relative">
					<input
						id="newPassword"
						{...changeAdminPassword.fields._newPassword.as(showNew ? 'text' : 'password')}
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
						placeholder="New password"
					/>
					<button
						type="button"
						onclick={() => (showNew = !showNew)}
						class="absolute top-2.5 right-3 cursor-pointer text-slate-400 hover:text-slate-700"
						aria-label="Toggle new password visibility"
					>
						{#if showNew}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
					</button>
				</div>
				{#each changeAdminPassword.fields._newPassword.issues() as issue}
					<p class="mt-1 text-xs text-red-500">{issue.message}</p>
				{/each}
			</div>

			<div>
				<label for="confirmPassword" class="mb-1.5 block text-xs font-bold text-slate-700">
					Confirm New Password
				</label>
				<div class="relative">
					<input
						id="confirmPassword"
						{...changeAdminPassword.fields._confirmPassword.as(showConfirm ? 'text' : 'password')}
						class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/15 focus:outline-none"
						placeholder="Confirm new password"
					/>
					<button
						type="button"
						onclick={() => (showConfirm = !showConfirm)}
						class="absolute top-2.5 right-3 cursor-pointer text-slate-400 hover:text-slate-700"
						aria-label="Toggle confirm password visibility"
					>
						{#if showConfirm}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
					</button>
				</div>
				{#each changeAdminPassword.fields._confirmPassword.issues() as issue}
					<p class="mt-1 text-xs text-red-500">{issue.message}</p>
				{/each}
			</div>

			<div class="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs">
				<div class="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
					{#each [
						{ label: 'At least 8 characters', ok: passwordValidations.minLength },
						{ label: 'One uppercase letter', ok: passwordValidations.hasUpperCase },
						{ label: 'One lowercase letter', ok: passwordValidations.hasLowerCase },
						{ label: 'One number', ok: passwordValidations.hasNumbers },
						{ label: 'One special character', ok: passwordValidations.hasSpecialChar }
					] as req}
						<div class={`flex items-center gap-2 ${req.ok ? 'font-semibold text-emerald-700' : 'text-slate-500'}`}>
							<span class={`h-1.5 w-1.5 rounded-full ${req.ok ? 'bg-emerald-600' : 'bg-slate-300'}`}></span>
							{req.label}
						</div>
					{/each}
				</div>
			</div>

			<div class="flex items-center gap-3 pt-1">
				<button
					type="submit"
					disabled={Boolean(changeAdminPassword.pending) ||
						!isPasswordValid ||
						confirmPasswordValue !== newPasswordValue}
					class="inline-flex min-h-[42px] cursor-pointer items-center justify-center rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#2563eb]/20 transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{changeAdminPassword.pending ? 'Updating...' : 'Update Password'}
				</button>

				<button
					type="button"
					onclick={() =>
						changeAdminPassword.fields.set({
							_oldPassword: '',
							_newPassword: '',
							_confirmPassword: ''
						})}
					class="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
				>
					Clear
				</button>
			</div>
		</form>
	</div>
</div>
