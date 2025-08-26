<script lang="ts">
	import CustomButton from "$lib/components/customUI/button/customButton.svelte";
	import MainButton from "$lib/components/customUI/button/MainButton.svelte";
	import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-svelte";

    let email = $state("");
    let password = $state("");
    let showPassword = $state(false);
    let isLoading = $state(false);
    let error = $state("");

    async function handleSubmit() {
        isLoading = true;
        error = "";

        try {
        // simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email === "admin@nivabit.com" && password === "admin123") {
            console.log("Login successful");
            // navigate programmatically if needed: goto('/')
        } else {
            error = "Invalid email or password";
        }
        } catch (err) {
        error = "Login failed. Please try again.";
        } finally {
        isLoading = false;
        }
    }

</script>


<section class="min-h-screen bg-brand-blue-900 flex items-center justify-center px-4 w-full">
    <!-- {/* Background decoration */} -->
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-brand-orange-500/5"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white/5"></div>
    </div>

    <div class="relative w-full max-w-md ">
        <div class="relative w-full">
            <!-- {/* Logo */} -->
            <div class="text-center mb-8">
                <a href="/" class="inline-block">
                    <img 
                        src="/images/logo.png"
                        alt="Nivabit Logo"
                        class="h-8 w-auto mx-auto mb-4"
                    />
                </a>
                <p class="text-brand-blue-100 font-synonym">
                Access your admin dashboard
                </p>
            </div>

            <!-- {/* Login Form */} -->
            <div class="bg-white rounded-2xl p-8 shadow-2xl">
                <form onsubmit={handleSubmit} class="space-y-6">
                <!-- {/* Email Field */} -->
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
                            bind:value={email}
                            class="w-full pl-10 pr-4 py-3 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent transition-colors block"
                            placeholder="admin@nivabit.com"
                        />
                    </div>
                </div>

                <!-- {/* Password Field */} -->
                <div>
                    <label for="password" class="block text-brand-grey-500 text-sm font-synonym font-medium mb-2">
                    Password
                    </label>
                    <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock class="h-5 w-5 text-brand-grey-200" />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        bind:value={password}
                        class="w-full pl-10 pr-12 py-3 border border-brand-grey-50 rounded-lg font-synonym placeholder:text-brand-grey-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent transition-colors"
                        placeholder="Enter your password"
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

                <!-- Error Message -->
                {#if error}
                <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p class="text-red-600 text-sm font-synonym">{error}</p>
                </div>
                {/if}

                <!-- {/* Remember Me & Forgot Password */} -->
                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                    <input
                        type="checkbox"
                        class="rounded border-brand-grey-50 text-brand-orange-500 focus:ring-brand-orange-500 focus:ring-offset-0"
                    />
                    <span class="ml-2 text-sm text-brand-grey-400 font-synonym">Remember me</span>
                    </label>
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
                        disabled={isLoading}
                        class="w-full bg-brand-orange-500 text-white py-3 px-4 rounded-lg font-synonym font-medium hover:bg-brand-orange-500/90 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {#if isLoading}
                            <div class="flex items-center justify-center">
                                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Signing in...
                            </div>
                        {:else}
                            Sign In
                        {/if}
                    </MainButton>
                </form>
            </div>

            <!-- {/* Back to Website */} -->
            <div class="text-center mt-6">
                <CustomButton
                    href="/"
                    className="inline-flex items-center gap-2 text-brand-blue-100 hover:text-white font-synonym text-sm transition-colors"
                    >
                    <div class="inline-flex items-center gap-2 text-brand-blue-100">
                        <ArrowLeft class="w-4 h-4" />
                        Back to website
                    </div>
                </CustomButton>
            </div>
        </div>
    </div>
</section>
