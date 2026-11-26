<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/dossier', { replaceState: true });
	});
</script>

<svelte:head>
	<meta http-equiv="refresh" content="0;url=/dossier" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[#f8fafc] text-xs font-semibold text-slate-500">
	Redirecting to /dossier...
</div>
