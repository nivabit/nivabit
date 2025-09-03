<script lang="ts">
	import { enhance } from "$app/forms";
  import CustomButton from "$lib/components/customUI/button/customButton.svelte";
	import MainButton from "$lib/components/customUI/button/MainButton.svelte";
  import { Mail, ArrowLeft, CheckCircle } from "lucide-svelte";
  

  let email = $state("");
  let isLoading = $state(false);
  let isEmailSent = $state(false);
  let formError: Record<string, string> | undefined = $state({});

</script>
  
<div class="min-h-screen bg-brand-blue-900 flex items-center justify-center px-4">
  <!-- Background decoration -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-brand-orange-500 opacity-5"></div>
    <div class="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white opacity-5"></div>
  </div>

  <div class="relative w-full max-w-md">
    <!-- Logo -->
    <div class="text-center mb-8">
      <a href="/" class="inline-block">
        <img 
          src="/images/logo.png"
          alt="Nivabit Logo"
          class="h-8 w-auto mx-auto mb-4"
        />
      </a>
      <h1 class="text-2xl md:text-3xl font-cabinet font-medium text-white mb-2">
        {#if isEmailSent}
          Check Your Email
        {:else}
          Forgot Password?
        {/if}
      </h1>
      <p class="text-brand-blue-100 font-synonym">
        {#if isEmailSent}
          We've sent password reset instructions to your email
        {:else}
          Enter your email address and we'll send you a link to reset your password
        {/if}
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-2xl p-8 shadow-2xl">
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
              if (result.type === "failure") {
                formError = result.data?.errors as any;
              } else if (result.type === "success") {
                isEmailSent = true;
              }
            };
          }}
        >
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-brand-grey-500 text-sm font-synonym font-medium mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-brand-grey-200" />
              </div>
              <input
                id="email"
                type="email"
                required
                name="email"
                bind:value={email}
                class="w-full pl-10 pr-4 py-3 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent transition-colors"
                placeholder="Enter your email address"
              />
            </div>
            {#if formError?.email}
              <p class="text-red-500 text-sm">{formError.email}</p>
            {/if}
          </div>

          <!-- API Error -->
          {#if formError?.errors}
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-red-600 text-sm">{formError.errors}</p>
            </div>
          {/if}


          <!-- Submit Button -->
          <MainButton
            type="submit"
            disabled={isLoading}
            class="w-full bg-brand-orange-500 text-white py-3 px-4 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if isLoading}
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Sending...
              </div>
            {:else}
              Send Reset Link
            {/if}
          </MainButton>
        </form>
      {:else}
        <!-- Email Sent Confirmation -->
        <div class="text-center space-y-6">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle class="h-8 w-8 text-green-600" />
          </div>

          <div class="space-y-2">
            <h3 class="text-lg font-cabinet font-medium text-brand-grey-500">
              Email Sent Successfully
            </h3>
            <p class="text-brand-grey-400 font-synonym text-sm">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div class="bg-bg-blue rounded-lg p-4 border border-brand-blue-100">
            <p class="text-xs text-brand-grey-400 font-synonym mb-2">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <p class="text-xs text-brand-grey-400 font-synonym">
              <strong>For Demo:</strong>{' '}
              <a
                href="/reset-password?token=demo-reset-token-12345"
                class="text-brand-orange-500 hover:underline"
              >
                Click here to test reset password
              </a>
            </p>
          </div>

          <!-- <MainButton
            onclick={handleResendEmail}
            disabled={isLoading}
            class="w-full bg-brand-orange-500 text-white py-3 px-4 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if isLoading}
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Resending...
              </div>
            {:else}
              Resend Email
            {/if}
          </MainButton> -->
        </div>
      {/if}
    </div>

    <!-- Back to Login -->
    <div class="text-center mt-6">
      <CustomButton
        href="/bits/admin/auth/login"
        className="inline-flex items-center gap-2 text-brand-blue-100 font-synonym text-sm transition-colors"
      >
        <div class="inline-flex items-center gap-2 text-brand-blue-100">
          <ArrowLeft class="w-4 h-4" />
          Back to login
        </div>
      </CustomButton>
    </div>
  </div>
</div>
  