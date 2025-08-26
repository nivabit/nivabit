<script lang="ts">
	import { fly} from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	import type { Snippet } from 'svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	let { children, data }:{data: {pathname:string}, children:Snippet} = $props();

</script>

{#key data.pathname}
	<Header />
	<main in:fly={{ easing: cubicOut, y: 10, duration: 100, delay: 100 }}>
		{@render children()}
	</main>
	<Footer />
{/key}
