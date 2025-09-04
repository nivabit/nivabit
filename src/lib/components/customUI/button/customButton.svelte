<script lang="ts">
	import { cn } from '$lib/utils';

	let { children, className, href = undefined, ...restProps } = $props();
</script>

{#if href}
	<a
		{href}
		role="button"
		class={cn(
			'flip-button block text-sm text-white transition-colors duration-300 hover:bg-transparent hover:underline',
			className
		)}
		{...restProps}
	>
		<span class="slide-text">
			<span class="text-top">{@render children?.()}</span>
			<span class="text-bottom text-brand-orange-500">{@render children?.()}</span>
		</span>
	</a>
{:else}
	<button
		type="button"
		class={cn(
			'flip-button text-sm text-white transition-colors duration-300 hover:bg-transparent hover:underline',
			className
		)}
	>
		<span class="slide-text">
			<span class="text-top">{@render children?.()}</span>
			<span class="text-bottom text-brand-orange-500">{@render children?.()}</span>
		</span>
	</button>
{/if}
