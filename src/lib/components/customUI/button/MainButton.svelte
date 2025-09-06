<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		children,
		...restProps
	}: any = $props();
</script>

<Button
	bind:this={ref}
	href={disabled ? undefined : href}
	data-slot="button"
	class={cn(
		'group relative h-12 w-48 overflow-hidden rounded-md transition-all duration-300 ease-in-out cursor-pointer',
		className
	)}
	{type}
	{disabled}
	{...restProps}
>
	<!-- Top Layer (default state) -->
	<div
		class={`${variant == 'outline' ? 'absolute inset-0 z-10 flex items-center justify-center text-brand-blue-700 transition-transform duration-300 ease-in-out group-hover:-translate-y-full' : 'absolute inset-0 z-10 flex items-center justify-center text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-full'}`}
	>
		{@render children?.()}
	</div>

	<!-- Bottom Layer (hover state) -->
	<div
		class={`${variant == 'outline' ? 'absolute inset-0 z-0 flex translate-y-full items-center justify-center text-brand-blue-700 transition-transform duration-300 ease-in-out group-hover:translate-y-0' : 'absolute inset-0 z-0 flex translate-y-full items-center justify-center bg-brand-blue-900 text-white transition-transform duration-300 ease-in-out group-hover:translate-y-0'}`}
	>
		{@render children?.()}
	</div>
</Button>