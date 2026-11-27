<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/?book=true', { replace: true });
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-[#f8fafc] text-xs font-semibold text-slate-500">
	Opening booking modal...
</div>
