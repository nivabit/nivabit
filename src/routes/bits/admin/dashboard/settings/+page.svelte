<script lang="ts">
	import { goto } from '$app/navigation';
	import CustomButton from '#lib/components/customUI/button/customButton.svelte';
	import MainButton from '#lib/components/customUI/button/MainButton.svelte';
	import { passwordRequirements } from '#lib/constants/passwordRequirements.js';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import {
		getAdminProfile,
		updateAdminProfile,
		changeAdminPassword
	} from '#lib/remote/admin.remote.ts';
	import { profileSchema, changePasswordSchema } from '#lib/validation/validation.ts';

	const defaultProfile = $derived(await getAdminProfile());

	let editing = $state(false);
	let showCurrent = $state(false);
	let showNew = $state(false);
	let showConfirm = $state(false);

	$effect(() => {
		if (!editing && defaultProfile) {
			updateAdminProfile.fields.set({
				name: defaultProfile.name ?? '',
				phone: defaultProfile.phone ?? ''
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

	const profileRootIssues = $derived(
		(updateAdminProfile.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);
	const passwordRootIssues = $derived(
		(changeAdminPassword.fields.allIssues() ?? []).filter((i) => !i.path?.length)
	);
</script>

<div class="max-w-3xl space-y-6">
	<div>
		<h1 class="font-cabinet text-2xl font-medium text-brand-grey-500">Settings</h1>
		<p class="font-synonym text-brand-grey-400">Update your profile and change password</p>
	</div>

	<!-- Profile Form -->
	<form
		class="rounded-xl border border-brand-grey-50 bg-white p-6"
		{...updateAdminProfile.preflight(profileSchema).enhance(async ({ submit }) => {
			const ok = await submit();
			if (!ok) return;
			editing = false;
			toast.success('Profile updated successfully');
		})}
		oninput={() => updateAdminProfile.validate()}
	>
		<div class="mb-4 flex items-center justify-between">
			<h3 class="font-cabinet font-medium text-brand-grey-500">Profile</h3>
			{#if !editing}
				<CustomButton
					type="button"
					onclick={() => (editing = true)}
					className="text-brand-orange-500 text-sm cursor-pointer"
				>
					Edit
				</CustomButton>
			{:else}
				<div class="flex items-center gap-2">
					<MainButton
						type="submit"
						disabled={Boolean(updateAdminProfile.pending)}
						class="w-24 rounded-lg bg-brand-orange-500 py-5 text-sm text-white"
					>
						{updateAdminProfile.pending ? 'Saving...' : 'Save'}
					</MainButton>

					<CustomButton
						type="button"
						onclick={() => {
							editing = false;
							updateAdminProfile.fields.set({
								name: defaultProfile.name ?? '',
								phone: defaultProfile.phone ?? ''
							});
						}}
						className="text-sm text-brand-grey-500 cursor-pointer"
					>
						Cancel
					</CustomButton>
				</div>
			{/if}
		</div>

		<div class="space-y-4">
			{#each profileRootIssues as issue}
				<p class="text-sm text-red-500">{issue.message}</p>
			{/each}

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="name" class="font-synonym mb-2 block text-sm text-brand-grey-500">
						Full Name
					</label>
					<input
						id="name"
						{...updateAdminProfile.fields.name.as('text')}
						disabled={!editing}
						class="w-full rounded-lg border border-brand-grey-50 px-3 py-2"
					/>
					{#each updateAdminProfile.fields.name.issues() as issue}
						<p class="mt-1 text-sm text-red-500">{issue.message}</p>
					{/each}
				</div>

				<div>
					<label for="phone" class="font-synonym mb-2 block text-sm text-brand-grey-500">
						Phone
					</label>
					<input
						id="phone"
						{...updateAdminProfile.fields.phone.as('text')}
						disabled={!editing}
						class="w-full rounded-lg border border-brand-grey-50 px-3 py-2"
					/>
					{#each updateAdminProfile.fields.phone.issues() as issue}
						<p class="mt-1 text-sm text-red-500">{issue.message}</p>
					{/each}
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="email" class="font-synonym mb-2 block text-sm text-brand-grey-500">
						Email
					</label>
					<input
						id="email"
						value={defaultProfile?.email ?? ''}
						disabled
						class="w-full rounded-lg border border-brand-grey-50 px-3 py-2"
					/>
				</div>

				<div>
					<label for="role" class="font-synonym mb-2 block text-sm text-brand-grey-500">
						Role
					</label>
					<input
						id="role"
						value={defaultProfile?.role ?? ''}
						disabled
						class="w-full rounded-lg border border-brand-grey-50 px-3 py-2"
					/>
				</div>
			</div>
		</div>
	</form>

	<!-- Change Password -->
	<div class="rounded-xl border border-brand-grey-50 bg-white p-6">
		<h3 class="font-cabinet mb-3 font-medium text-brand-grey-500">Change Password</h3>

		<form
			class="space-y-4"
			{...changeAdminPassword.preflight(changePasswordSchema).enhance(async ({ form, submit }) => {
				const ok = await submit();
				if (!ok) return;
				editing = false;
				form.reset();
				toast.success('Password changed successfully. Please login again.');
				goto('/bits/admin/auth/login');
			})}
			oninput={() => changeAdminPassword.validate()}
		>
			{#each passwordRootIssues as issue}
				<p class="text-sm text-red-500">{issue.message}</p>
			{/each}

			<div>
				<label for="oldPassword" class="font-synonym mb-2 block text-sm text-brand-grey-500">
					Current Password
				</label>
				<div class="relative">
					<input
						id="oldPassword"
						{...changeAdminPassword.fields._oldPassword.as(showCurrent ? 'text' : 'password')}
						class="w-full rounded-lg border border-brand-grey-50 px-3 py-2 pr-10"
						placeholder="Old password"
					/>
					<button
						type="button"
						onclick={() => (showCurrent = !showCurrent)}
						class="absolute top-2 right-2 text-brand-grey-400"
					>
						{#if showCurrent}<EyeOff />{:else}<Eye />{/if}
					</button>
				</div>
				{#each changeAdminPassword.fields._oldPassword.issues() as issue}
					<p class="mt-1 text-sm text-red-500">{issue.message}</p>
				{/each}
			</div>

			<div>
				<label for="newPassword" class="font-synonym mb-2 block text-sm text-brand-grey-500">
					New Password
				</label>
				<div class="relative">
					<input
						id="newPassword"
						{...changeAdminPassword.fields._newPassword.as(showNew ? 'text' : 'password')}
						class="w-full rounded-lg border border-brand-grey-50 px-3 py-2 pr-10"
						placeholder="New password"
					/>
					<button
						type="button"
						onclick={() => (showNew = !showNew)}
						class="absolute top-2 right-2 text-brand-grey-400"
					>
						{#if showNew}<EyeOff />{:else}<Eye />{/if}
					</button>
				</div>
				{#each changeAdminPassword.fields._newPassword.issues() as issue}
					<p class="mt-1 text-sm text-red-500">{issue.message}</p>
				{/each}
			</div>

			<div>
				<label for="confirmPassword" class="font-synonym mb-2 block text-sm text-brand-grey-500">
					Confirm New Password
				</label>
				<div class="relative">
					<input
						id="confirmPassword"
						{...changeAdminPassword.fields._confirmPassword.as(showConfirm ? 'text' : 'password')}
						class="w-full rounded-lg border border-brand-grey-50 px-3 py-2 pr-10"
						placeholder="Confirm password"
					/>
					<button
						type="button"
						onclick={() => (showConfirm = !showConfirm)}
						class="absolute top-2 right-2 text-brand-grey-400"
					>
						{#if showConfirm}<EyeOff />{:else}<Eye />{/if}
					</button>
				</div>
				{#each changeAdminPassword.fields._confirmPassword.issues() as issue}
					<p class="mt-1 text-sm text-red-500">{issue.message}</p>
				{/each}
			</div>

			<div class="rounded-lg border border-brand-blue-100 bg-bg-blue p-3 text-sm">
				{#each [
					{ label: 'At least 8 characters', ok: passwordValidations.minLength },
					{ label: 'One uppercase letter', ok: passwordValidations.hasUpperCase },
					{ label: 'One lowercase letter', ok: passwordValidations.hasLowerCase },
					{ label: 'One number', ok: passwordValidations.hasNumbers },
					{ label: 'One special character', ok: passwordValidations.hasSpecialChar }
				] as req}
					<div class={`flex items-center gap-2 ${req.ok ? 'text-green-600' : 'text-brand-grey-400'}`}>
						<div class={`h-1.5 w-1.5 rounded-full ${req.ok ? 'bg-green-600' : 'bg-brand-grey-200'}`}></div>
						{req.label}
					</div>
				{/each}
			</div>

			<div class="flex items-center gap-3">
				<MainButton
					type="submit"
					disabled={Boolean(changeAdminPassword.pending) ||
						!isPasswordValid ||
						confirmPasswordValue !== newPasswordValue}
					class="cursor-pointer rounded-lg bg-brand-orange-500 py-6 text-white"
				>
					{changeAdminPassword.pending ? 'Updating...' : 'Update Password'}
				</MainButton>

				<CustomButton
					type="button"
					onclick={() =>
						changeAdminPassword.fields.set({
							_oldPassword: '',
							_newPassword: '',
							_confirmPassword: ''
						})}
					className="text-sm text-brand-grey-500 cursor-pointer"
				>
					Clear
				</CustomButton>
			</div>
		</form>
	</div>
</div>
