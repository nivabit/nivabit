<script lang="ts">
	import '../app.css';
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	import type { Snippet } from 'svelte';
	import ProgressSpinner from '$lib/components/loader/ProgressSpinner.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import Footer from '$lib/components/layout/footer.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	let { children, data }: { data: { pathname: string }; children: Snippet } = $props();
</script>

<Toaster theme="light" position="bottom-right" />
<ProgressSpinner />

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

{#key data.pathname}
	<!-- <Header /> -->
	<main in:fly={{ easing: cubicOut, y: 10, duration: 100, delay: 100 }}>
		{@render children()}
	</main>
	<!-- <Footer /> -->
{/key}
