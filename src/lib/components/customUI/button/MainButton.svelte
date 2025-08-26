
<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { cn } from "$lib/utils";

	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: any = $props();
</script>

<!-- {#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else} -->
	<!-- Inside the <button> tag in your existing code -->
	<!-- <button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), "relative overflow-hidden w-48 h-12", className)}
		{type}
		{disabled}
		{...restProps}
	>
		<span class="text-slide-wrapper">
		  <span class="text-top">{@render children?.()}</span>
		  <span class="text-bottom bg-brand-blue-700 w-full">{@render children?.()}</span>
		</span>
	</button>	   -->

<Button
  bind:this={ref}
  href={disabled ? undefined : href}
  data-slot="button"
  class={cn(
    "relative overflow-hidden transition-all duration-300 ease-in-out h-12 w-48 rounded-md group",
    className
  )}
  {type}
  {disabled}
  {...restProps}
>
  <!-- Top Layer (default state) -->
  <div
    class={`${variant == "outline" ? "absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full text-brand-blue-700 z-10 ease-in-out" : "absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full text-white z-10 ease-in-out"}`}
  >
    {@render children?.()}
  </div>

  <!-- Bottom Layer (hover state) -->
  <div
    class={`${variant == "outline" ?"absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-brand-blue-700 z-0 ease-in-out" : "absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0 bg-brand-blue-900 text-white z-0 ease-in-out"}`}
  >
    {@render children?.()}
  </div>
</Button>
