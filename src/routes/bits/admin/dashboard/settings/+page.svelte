<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import CustomButton from '$lib/components/customUI/button/customButton.svelte';
	import MainButton from '$lib/components/customUI/button/MainButton.svelte';
	import { passwordRequirements } from '$lib/constants/passwordRequirements.js';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();
	
	// --- Profile state ---
	let defaultProfile = $derived(data?.user)
	let profile = $derived({ ...defaultProfile });
	
	let formError: Record<string, string[]> | undefined = $state({});
	let formPasswordError: Record<string, string[]> | undefined = $state({});
	let editing = $state(false);
	let saveLoading = $state(false);

	// --- Password state ---
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let showCurrent = $state(false);
	let showNew = $state(false);
	let showConfirm = $state(false);
	let pwdLoading = $state(false);

	let passwordValidations = $derived(passwordRequirements(newPassword));

	let isPasswordValid = $derived(
		passwordValidations.minLength &&
		passwordValidations.hasUpperCase &&
		passwordValidations.hasLowerCase &&
		passwordValidations.hasNumbers &&
		passwordValidations.hasSpecialChar
	);

</script>

<div class="space-y-6 max-w-3xl">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-cabinet font-medium text-brand-grey-500">Settings</h1>
		<p class="text-brand-grey-400 font-synonym">Update your profile and change password</p>
	</div>

	<!-- Profile Form -->
	<form class="bg-white rounded-xl border border-brand-grey-50 p-6"
		method="post"
		action="?/updateProfile"
		use:enhance={() => {
			saveLoading = true;
			formError = {};
			return async ({ result }) => {
				saveLoading = false;
				if (result.type === 'failure' && result.data) {
					formError = result.data?.error as any;
				} else if (result.type === 'error') {
					formError = { name: result.error.message || result.error };
				} else if (result.type === 'success') {
					editing = false;
					toast.success("Profile updated successfully")
					invalidateAll();
				}
			};
		}}
	>
		<div class="flex items-center justify-between mb-4">
			<h3 class="font-cabinet font-medium text-brand-grey-500">Profile</h3>
			{#if !editing}
				<CustomButton  onclick={() => (editing = true)} className="text-brand-orange-500 text-sm cursor-pointer">Edit</CustomButton>
			{:else}
				<div class="flex items-center gap-2">
					<MainButton type="submit" disabled={saveLoading} class="bg-brand-orange-500 text-white py-5 w-24 rounded-lg text-sm">{saveLoading ? 'Saving...' : 'Save'}</MainButton>

					<CustomButton onclick={() => { editing = false; profile = { ...defaultProfile }; }} className="text-sm text-brand-grey-500 cursor-pointer">Cancel</CustomButton>
				</div>
			{/if}
		</div>

		<div class="space-y-4">
			{#if formError?.name}
				<p class="text-sm text-red-500">{formError?.name}</p>
			{/if}

			{#if formError?.phone}
				<p class="text-sm text-red-500">{formError?.phone}</p>
			{/if}

			{#if formError?.error}
				<p class="text-sm text-red-500">{formError?.error}</p>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="name" class="text-sm text-brand-grey-500 font-synonym mb-2 block">Full Name</label>
					<input bind:value={profile.name} name="name" id="name" disabled={!editing} class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg" />
				</div>

				<div>
					<label for="phone"  class="text-sm text-brand-grey-500 font-synonym mb-2 block">Phone</label>
					<input name="phone" id="phone" bind:value={profile.phone} disabled={!editing} class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg" />
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="email" class="text-sm text-brand-grey-500 font-synonym mb-2 block">Email</label>
					<input value={profile.email} disabled class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg" />
				</div>

				<div>
					<label for="role" class="text-sm text-brand-grey-500 font-synonym mb-2 block">Role</label>
					<input value={profile.role} disabled class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg" />
				</div>
			</div>
		</div>
	</form>

	<!-- Change Password -->
	<div class="bg-white rounded-xl border border-brand-grey-50 p-6">
		<h3 class="font-cabinet font-medium text-brand-grey-500 mb-3">Change Password</h3>

		<form class="space-y-4"
		method="post"
		action="?/changePassword"
		use:enhance={() => {
			pwdLoading = true;
			formPasswordError = {};
			return async ({ result }) => {
				pwdLoading = false;
				if (result.type === 'failure' && result.data) {
					formPasswordError = result.data?.error as any;
				} else if (result.type === 'error') {
					formPasswordError = { name: result.error.message || result.error };
				} else if (result.type === 'success') {
					editing = false;
					toast.success("Password changed successfully. Please login again.")
					// Invalidate all data
					invalidateAll();
					// Redirect to login
					goto("/bits/admin/auth/login");
				}
			};
		}}
		>
			<!-- Errors -->
			<div class="space-y-1">
				{#if formPasswordError?.oldPassword}
					<p class="text-sm text-red-500">{formPasswordError?.oldPassword}</p>
				{/if}

				{#if formPasswordError?.newPassword}
					<p class="text-sm text-red-500">{formPasswordError?.newPassword}</p>
				{/if}

				{#if formPasswordError?.confirmPassword}
					<p class="text-sm text-red-500">{formPasswordError?.confirmPassword}</p>
				{/if}

				{#if formPasswordError?.error}
					<p class="text-sm text-red-500">{formPasswordError?.error}</p>
				{/if}

				{#if confirmPassword && confirmPassword !== newPassword}
					<p class="text-sm text-red-500 mt-1">Passwords do not match</p>
				{/if}
				
				{#if newPassword && !isPasswordValid}
					<p class="text-sm text-red-500 mt-1">New password does not meet all requirements</p>
				{/if}
			</div>

			<!-- Current -->
			<div>
				<label for="oldPassword" class="text-sm text-brand-grey-500 font-synonym mb-2 block">Current Password</label>
				<div class="relative">
					<input type={showCurrent ? 'text' : 'password'} bind:value={currentPassword} class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg pr-10" name="oldPassword" id="oldPassword" placeholder="Old password" />
					<button type="button" onclick={() => (showCurrent = !showCurrent)} class="absolute right-2 top-2 text-brand-grey-400">
						{#if showCurrent}<EyeOff />{:else}<Eye />{/if}
					</button>
				</div>
			</div>

			<!-- New -->
			<div>
				<label for="newPassword" class="text-sm text-brand-grey-500 font-synonym mb-2 block">New Password</label>
				<div class="relative">
					<input type={showNew ? 'text' : 'password'} bind:value={newPassword} class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg pr-10" name="newPassword" id="newPassword" placeholder="New password" />
					<button type="button" onclick={() => (showNew = !showNew)} class="absolute right-2 top-2 text-brand-grey-400">
						{#if showNew}<EyeOff />{:else}<Eye />{/if}
					</button>
				</div>
			</div>

			<!-- Confirm -->
			<div>
				<label for="confirmPassword" class="text-sm text-brand-grey-500 font-synonym mb-2 block">Confirm New Password</label>
				<div class="relative">
					<input type={showConfirm ? 'text' : 'password'} bind:value={confirmPassword} class="w-full px-3 py-2 border border-brand-grey-50 rounded-lg pr-10" name="confirmPassword" id="confirmPassword" placeholder="Confirm password" />
					<button type="button" onclick={() => (showConfirm = !showConfirm)} class="absolute right-2 top-2 text-brand-grey-400">
						{#if showConfirm}<EyeOff />{:else}<Eye />{/if}
					</button>
				</div>
			</div>

			<!-- Password Requirements -->
			<div class="bg-bg-blue rounded-lg p-3 border border-brand-blue-100 text-sm">
				{#each [
					{ label: 'At least 8 characters', ok: passwordRequirements(newPassword).minLength },
					{ label: 'One uppercase letter', ok: passwordRequirements(newPassword).hasUpperCase },
					{ label: 'One lowercase letter', ok: passwordRequirements(newPassword).hasLowerCase },
					{ label: 'One number', ok: passwordRequirements(newPassword).hasNumbers },
					{ label: 'One special character', ok: passwordRequirements(newPassword).hasSpecialChar }
				] as req}
					<div class={`flex items-center gap-2 ${req.ok ? 'text-green-600' : 'text-brand-grey-400'}`}>
						<div class={`w-1.5 h-1.5 rounded-full ${req.ok ? 'bg-green-600' : 'bg-brand-grey-200'}`}></div>
						{req.label}
					</div>
				{/each}
			</div>

			<div class="flex items-center gap-3">
				<MainButton type="submit" disabled={pwdLoading || !isPasswordValid} class="bg-brand-orange-500 text-white py-6 rounded-lg cursor-pointer">{pwdLoading ? 'Updating...' : 'Update Password'}</MainButton>

				<CustomButton type="button" onclick={() => { currentPassword = ''; newPassword = ''; confirmPassword = ''; }} className="text-sm text-brand-grey-500 cursor-pointer">Clear</CustomButton>
			</div>
		</form>
	</div>
</div>
