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


  // --- Token validation from URL ---
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
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar
    };
  };

  const passwordValidation = $derived(validatePassword(password));
  const passwordsMatch = $derived(password === confirmPassword && confirmPassword !== '');


</script>

{#if !isValidToken}
  <!-- Invalid token UI -->
  <div class="min-h-screen bg-brand-blue-900 flex items-center justify-center px-4">
    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <img
          src="/images/logo.png"
          alt="Nivabit Logo"
          class="h-8 w-auto mx-auto mb-4"
        />
        <h1 class="text-2xl md:text-3xl font-cabinet font-medium text-white mb-2">
          Invalid Reset Link
        </h1>
        <p class="text-brand-blue-100 font-synonym">
          This password reset link is invalid or has expired
        </p>
      </div>

      <div class="bg-white rounded-2xl p-8 shadow-2xl text-center">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle class="h-8 w-8 text-red-600" />
        </div>

        <h3 class="text-lg font-cabinet font-medium text-brand-grey-500 mb-2">
          Link Expired or Invalid
        </h3>
        <p class="text-brand-grey-400 font-synonym text-sm mb-6">
          Please request a new password reset link
        </p>

        <a
          href="/forgot-password"
          class="w-full inline-block bg-brand-orange-500 text-white py-3 px-4 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 transition-colors text-center"
        >
          Request New Link
        </a>
      </div>

      <div class="text-center mt-6">
        <a
          href="/login"
          class="inline-flex items-center gap-2 text-brand-blue-100 hover:text-white font-synonym text-sm transition-colors"
        >
          Back to login
        </a>
      </div>
    </div>
  </div>
{:else}
  <!-- Valid token UI -->
  <div class="min-h-screen bg-brand-blue-900 flex items-center justify-center px-4">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-brand-orange-500 opacity-5"></div>
      <div class="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white opacity-5"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <a href="/" class="inline-block">
          <img
            src="/images/logo.png"
            alt="Nivabit Logo"
            class="h-8 w-auto mx-auto mb-4"
          />
        </a>
        <h1 class="text-2xl md:text-3xl font-cabinet font-medium text-white mb-2">
          {isSuccess ? 'Password Reset Complete' : 'Create New Password'}
        </h1>
        <p class="text-brand-blue-100 font-synonym">
          {isSuccess
            ? 'Your password has been successfully updated'
            : 'Please create a strong password for your account'}
        </p>
      </div>

      <div class="bg-white rounded-2xl p-8 shadow-2xl">
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
                if (result.type === "failure") {
                  formError = result.data?.errors || {error: "Failed to reset password"} as any;
                } else if (result.type === "success") {
                  isSuccess = true;
                  setTimeout(() => {
                    window.location.href = "/login";
                  }, 3000);
                }
              };
            }}
          >
            <!-- New Password -->
            <div>
              <label for="password" class="block text-brand-grey-500 text-sm font-synonym font-medium mb-2">
                New Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-brand-grey-200" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  bind:value={password}
                  required
                  class="w-full pl-10 pr-12 py-3 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onclick={() => (showPassword = !showPassword)}
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {#if showPassword}
                    <EyeOff class="h-5 w-5 text-brand-grey-200 hover:text-brand-grey-400 transition-colors" />
                  {:else}
                    <Eye class="h-5 w-5 text-brand-grey-200 hover:text-brand-grey-400 transition-colors" />
                  {/if}
                </button>
              </div>
            </div>

            <!-- Password requirements -->
            {#if password}
              <div class="bg-bg-blue rounded-lg p-4 border border-brand-blue-100">
                <h4 class="text-sm font-synonym font-medium text-brand-grey-500 mb-2">Password Requirements:</h4>
                <div class="space-y-1 text-xs font-synonym">
                  <div class={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-brand-grey-400'}`}>
                    <div class={`w-1.5 h-1.5 rounded-full ${passwordValidation.minLength ? 'bg-green-600' : 'bg-brand-grey-200'}`}></div>
                    At least 8 characters
                  </div>
                  <div class={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-brand-grey-400'}`}>
                    <div class={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-600' : 'bg-brand-grey-200'}`}></div>
                    One uppercase letter
                  </div>
                  <div class={`flex items-center gap-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-brand-grey-400'}`}>
                    <div class={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasLowerCase ? 'bg-green-600' : 'bg-brand-grey-200'}`}></div>
                    One lowercase letter
                  </div>
                  <div class={`flex items-center gap-2 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-brand-grey-400'}`}>
                    <div class={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasNumbers ? 'bg-green-600' : 'bg-brand-grey-200'}`}></div>
                    One number
                  </div>
                  <div class={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-brand-grey-400'}`}>
                    <div class={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasSpecialChar ? 'bg-green-600' : 'bg-brand-grey-200'}`}></div>
                    One special character
                  </div>
                </div>
              </div>
            {/if}

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-brand-grey-500 text-sm font-synonym font-medium mb-2">
                Confirm New Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-brand-grey-200" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  bind:value={confirmPassword}
                  required
                  class="w-full pl-10 pr-12 py-3 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onclick={() => (showConfirmPassword = !showConfirmPassword)}
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {#if showConfirmPassword}
                    <EyeOff class="h-5 w-5 text-brand-grey-200 hover:text-brand-grey-400 transition-colors" />
                  {:else}
                    <Eye class="h-5 w-5 text-brand-grey-200 hover:text-brand-grey-400 transition-colors" />
                  {/if}
                </button>
              </div>
              {#if confirmPassword && !passwordsMatch}
                <p class="text-red-600 text-xs font-synonym mt-1">Passwords do not match</p>
              {:else if confirmPassword && passwordsMatch}
                <p class="text-green-600 text-xs font-synonym mt-1">Passwords match</p>
              {/if}
            </div>

            <!-- Error -->
            {#if error}
              <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                <p class="text-red-600 text-sm font-synonym">{error}</p>
              </div>
            {/if}

            <!-- Submit -->
            <button
              type="submit"
              disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
              class="w-full bg-brand-orange-500 text-white py-3 px-4 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {#if isLoading}
                <div class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Updating Password...
                </div>
              {:else}
                Update Password
              {/if}
            </button>
          </form>
        {:else}
          <!-- Success -->
          <div class="text-center space-y-6">
            <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle class="h-8 w-8 text-green-600" />
            </div>
            <div class="space-y-2">
              <h3 class="text-lg font-cabinet font-medium text-brand-grey-500">
                Password Updated Successfully
              </h3>
              <p class="text-brand-grey-400 font-synonym text-sm">
                Your password has been changed. You will be redirected to the login page.
              </p>
            </div>
            <div class="bg-bg-blue rounded-lg p-4 border border-brand-blue-100">
              <p class="text-xs text-brand-grey-400 font-synonym">
                Redirecting to login page in 3 seconds...
              </p>
            </div>
            <a
              href="/bits/admin/auth/login"
              class="w-full inline-block bg-brand-orange-500 text-white py-3 px-4 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 transition-colors text-center"
            >
              Go to Login
            </a>
          </div>
        {/if}
      </div>

      <!-- Back to login -->
      {#if !isSuccess}
        <div class="text-center mt-6">
          <a
            href="/bits/admin/auth/login"
            class="inline-flex items-center gap-2 text-brand-blue-100 hover:text-white font-synonym text-sm transition-colors"
          >
            Back to login
          </a>
        </div>
      {/if}
    </div>
  </div>
{/if}
