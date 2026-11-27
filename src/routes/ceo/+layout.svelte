<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import AppSidebar from '#lib/components/app-sidebar.svelte';
	import SiteHeader from '#lib/components/site-header.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import ProgressSpinner from '#lib/components/loader/ProgressSpinner.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.ts';
	import { toast } from 'svelte-sonner';
	import { heartbeatAdmin, logoutAdmin } from '#lib/remote/auth.remote.ts';

	let { children, data }: { data: { pathname: string }; children: Snippet } = $props();

	let isAuthPage = $derived(
		page.url.pathname.includes('/login') ||
			page.url.pathname.includes('/forgotpassword') ||
			page.url.pathname.includes('/reset-password')
	);

	// 5-minute inactivity auto-logout + silent heartbeat while active
	$effect(() => {
		if (isAuthPage) return;

		const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
		const HEARTBEAT_INTERVAL_MS = 2 * 60 * 1000; // keep session fresh every 2 min while active

		let lastActivity = Date.now();
		let idleTimer: ReturnType<typeof setTimeout>;
		let loggingOut = false;

		async function triggerIdleLogout() {
			if (loggingOut) return;
			loggingOut = true;
			try {
				await logoutAdmin();
			} catch {
				// ignore network errors on logout
			}
			toast.info('Logged out after 5 minutes of inactivity.');
			await goto('/ceo/login', { invalidateAll: true }).catch(() => {
				window.location.href = '/ceo/login';
			});
		}

		function resetIdleTimer() {
			lastActivity = Date.now();
			clearTimeout(idleTimer);
			idleTimer = setTimeout(triggerIdleLogout, IDLE_TIMEOUT_MS);
		}

		const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
		for (const evt of activityEvents) {
			window.addEventListener(evt, resetIdleTimer, { passive: true });
		}

		// Start initial 5-minute countdown
		resetIdleTimer();

		// Periodically refresh token & server last-active cookie while user is active
		const heartbeatInterval = setInterval(async () => {
			if (Date.now() - lastActivity < IDLE_TIMEOUT_MS) {
				try {
					const res = await heartbeatAdmin();
					if (res && !res.active) {
						await triggerIdleLogout();
					}
				} catch {
					// ignore transient network glitches
				}
			}
		}, HEARTBEAT_INTERVAL_MS);

		return () => {
			clearTimeout(idleTimer);
			clearInterval(heartbeatInterval);
			for (const evt of activityEvents) {
				window.removeEventListener(evt, resetIdleTimer);
			}
		};
	});
</script>

<Toaster theme="light" position="bottom-right" />
<ProgressSpinner />

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<title>Nivabit CEO Command Center</title>
</svelte:head>

{#if isAuthPage}
	<main class="min-h-screen w-full">
		{@render children()}
	</main>
{:else}
	{#key data.pathname}
		<Sidebar.Provider
			style="--sidebar-width: calc(var(--spacing) * 62); --header-height: calc(var(--spacing) * 12);"
		>
			<AppSidebar variant="inset" />
			<Sidebar.Inset>
				<SiteHeader />
				<div class="flex flex-1 flex-col bg-slate-50/60">
					<div class="@container/main flex flex-1 flex-col gap-2">
						<main
							in:fly={{ easing: cubicOut, y: 10, duration: 100, delay: 100 }}
							class="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6"
						>
							{@render children()}
						</main>
					</div>
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	{/key}
{/if}
