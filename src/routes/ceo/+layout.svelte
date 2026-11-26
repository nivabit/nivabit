<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import AppSidebar from '#lib/components/app-sidebar.svelte';
	import SiteHeader from '#lib/components/site-header.svelte';
	import { page } from '$app/state';

	import type { Snippet } from 'svelte';
	import ProgressSpinner from '#lib/components/loader/ProgressSpinner.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.ts';
	let { children, data }: { data: { pathname: string }; children: Snippet } = $props();

	let isAuthPage = $derived(
		page.url.pathname.includes('/login') ||
		page.url.pathname.includes('/forgotpassword') ||
		page.url.pathname.includes('/reset-password')
	);
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
