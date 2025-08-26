<script lang="ts">
	import { cn } from "$lib/utils";


    let {children, className, href=undefined, ...restProps} = $props()

</script>

{#if href}
    <a
        href={href}
        role="button"
        class={cn("flip-button text-white text-sm hover:underline hover:bg-transparent transition-colors duration-300 block", className)}
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
        class={cn("flip-button text-white text-sm hover:underline hover:bg-transparent transition-colors duration-300", className)}
    >
        <span class="slide-text">
        <span class="text-top">{@render children?.()}</span>
        <span class="text-bottom text-brand-orange-500">{@render children?.()}</span>
        </span>
    </button>
{/if}