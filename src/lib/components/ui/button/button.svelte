<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive:
					"bg-destructive shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white",
				outline:
					"bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border",
				secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
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
	}: ButtonProps = $props();
</script>

{#if href}
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
{:else}
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

	<button
  bind:this={ref}
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
</button>

{/if}
