<script lang="ts">
	let {
		variant = 'dark',
		iconOnly = false,
		class: className = 'h-7 w-auto'
	}: {
		variant?: 'dark' | 'light';
		iconOnly?: boolean;
		class?: string;
	} = $props();

	let wordColor = $derived(variant === 'light' ? '#FFFFFF' : '#0B0F1A');
	let markColor = $derived(variant === 'light' ? '#60A5FA' : '#2563EB');
</script>

{#if iconOnly}
	<svg
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class={className}
		aria-label="Nivabit"
	>
		<g fill={markColor}>
			<rect x="0" y="0" width="8" height="8" rx="1" />
			<rect x="0" y="8" width="8" height="8" rx="1" />
			<rect x="0" y="24" width="8" height="8" rx="1" />
			<rect x="8" y="16" width="8" height="8" rx="1" />
			<rect x="16" y="8" width="8" height="8" rx="1" />
			<rect x="24" y="0" width="8" height="8" rx="1" />
			<rect x="24" y="16" width="8" height="8" rx="1" />
			<rect x="24" y="24" width="8" height="8" rx="1" />
		</g>
	</svg>
{:else}
	<span class={`inline-flex items-center gap-0.5 select-none ${className}`}>
		<svg
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="h-[1.15em] w-auto shrink-0"
			aria-hidden="true"
		>
			<g fill={markColor}>
				<rect x="0" y="0" width="8" height="8" rx="1" />
				<rect x="0" y="8" width="8" height="8" rx="1" />
				<rect x="0" y="24" width="8" height="8" rx="1" />
				<rect x="8" y="16" width="8" height="8" rx="1" />
				<rect x="16" y="8" width="8" height="8" rx="1" />
				<rect x="24" y="0" width="8" height="8" rx="1" />
				<rect x="24" y="16" width="8" height="8" rx="1" />
				<rect x="24" y="24" width="8" height="8" rx="1" />
			</g>
		</svg>
		<span
			class="font-cabinet text-[1.25em] leading-none font-extrabold tracking-[-0.03em]"
			style={`color: ${wordColor};`}
		>
			ivabit
		</span>
	</span>
{/if}
